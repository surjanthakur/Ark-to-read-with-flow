from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from ..core.logginig import get_logger
from ..core.settings import settings
from ..main import rate_limiter
from ..services.auth_services import (
    authenticate_user,
    get_current_user,
    logout_session_user,
)
from ..utils.auth import oauth_client
from ..utils.get_db_session import get_db_session

logger = get_logger(__name__)

router = APIRouter(tags=["auth endpoints"])


# * GOOGLE OAUTH LOGIN REDIRECT ROUTE


@router.get(
    "/login",
    status_code=status.HTTP_307_TEMPORARY_REDIRECT,
    response_class=RedirectResponse,
    summary="Start Google sign-in",
    description="Clears any existing OAuth state and redirects the browser to Google for account consent. Google returns to the configured OAuth callback.",
    response_description="Redirect to Google's OAuth consent page.",
)
@rate_limiter.limit("3/minute")
async def login(request: Request):
    """
    api endpoint to redirect user to google oauth-page for login consent.
    """
    request.session.clear()
    auth_redirect_url = settings.AUTH_REDIRECT_URL
    return await oauth_client.google_auth.authorize_redirect(
        request, auth_redirect_url, prompt="consent"
    )


# * AUTHENTICATE GOOGLE OAUTH USER ROUTE


@router.get(
    "/auth/callback",
    status_code=status.HTTP_200_OK,
    response_class=HTMLResponse,
    summary="Complete Google sign-in",
    description=(
        "Handles Google's OAuth callback, creates an application session for the "
        "signed-in user, and sets the HttpOnly `oauth_session` cookie. New users "
        "are created on their first successful sign-in."
    ),
    response_description="HTML response that notifies the opener and closes the login window.",
    responses={
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Authentication could not be completed."
        }
    },
)
@rate_limiter.limit("3/minute")
async def auth(
    request: Request,
    db_session: AsyncSession = Depends(get_db_session),  # noqa: B008
):
    """
     api endpoint to extract user information from google oauth user's token.\n
    - and create new user and new session token if user not exists in DB.\n
    - if user already exists in the DB create new session token only.
    """
    return await authenticate_user(req=request, db_session=db_session)


# * GET CURRENT USER INFORMATION ROUTE


@router.get(
    "/auth/me",
    status_code=status.HTTP_200_OK,
    summary="Get the signed-in user",
    description=(
        "Returns the profile associated with the `oauth_session` cookie. "
        "The response includes an `is_authenticated: true` header."
    ),
    response_description="The signed-in user's username, email, and profile image URL.",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "The session cookie is missing or invalid."
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The session references a user that no longer exists."
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "The user profile could not be retrieved."
        },
    },
)
async def current_user(
    request: Request,
    db_session: AsyncSession = Depends(get_db_session),  # noqa: B008
):
    """
    api endpoint to get current user information if its authenticated.
    """
    return await get_current_user(request, db_session)


# * LOGOUT USER ROUTE


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Sign out the current user",
    description=(
        "Invalidates the session identified by the `oauth_session` cookie and "
        "expires that cookie in the browser."
    ),
    response_description="Confirmation that the user has been signed out.",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "The session cookie is missing or invalid."
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "The session could not be invalidated."
        },
    },
)
@rate_limiter.limit("3/minute")
async def logout_user(request: Request):
    """
    api endpoint to logout current session user.
    """
    return await logout_session_user(request)
