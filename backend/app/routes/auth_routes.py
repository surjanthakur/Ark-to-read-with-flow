from fastapi import APIRouter, Depends, Request, status
from sqlmodel.ext.asyncio.session import AsyncSession

from ..core.logginig import get_logger
from ..core.settings import settings
from ..services.auth_services import (
    authenticate_user,
    get_current_user,
    logout_session_user,
)
from ..utils.auth import oauth_client
from ..utils.get_db_session import get_db_session

logger = get_logger(__name__)

router = APIRouter(tags=["auth endpoints"])


@router.get("/login", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def login(request: Request):
    """
    api endpoint to redirect user to google oauth-page for login consent.
    """
    request.session.clear()
    auth_redirect_url = settings.AUTH_REDIRECT_URL
    return await oauth_client.google_auth.authorize_redirect(
        request, auth_redirect_url, prompt="consent"
    )


@router.get("/auth/callback", status_code=status.HTTP_200_OK)
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


@router.get("/auth/me", status_code=status.HTTP_200_OK)
async def current_user(
    request: Request,
    db_session: AsyncSession = Depends(get_db_session),  # noqa: B008
):
    """
    api endpoint to get current user information if its authenticated.
    """
    return await get_current_user(request, db_session)


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout_user(request: Request):
    """
    api endpoint to logout current session user.
    """
    return await logout_session_user(request)
