from fastapi import APIRouter, Depends, Request
from sqlmodel.ext.asyncio.session import AsyncSession

from ..core.logginig import get_logger
from ..core.settings import settings
from ..services.auth_services import authenticate_user, get_current_user
from ..utils.auth import oauth_client
from ..utils.get_db_session import get_db_session

logger = get_logger(__name__)

router = APIRouter()


@router.get("/login")
async def login(request: Request):
    """
    endpoints for logging in and authenticating users\n
    redirect user to google oauth endpoint.
    """

    request.session.clear()

    auth_redirect_url = settings.AUTH_REDIRECT_URL

    logger.info("redirecting user to google oauth page.")

    return await oauth_client.google_auth.authorize_redirect(
        request, auth_redirect_url, prompt="consent"
    )


@router.get("/auth/callback")
async def auth(
    request: Request,
    db_session: AsyncSession = Depends(get_db_session),  # noqa: B008
):
    logger.info("calling aunthenticate_user function to extract info.")
    res = await authenticate_user(req=request, db_session=db_session)
    logger.info("aunthenticate_user function return successfully.")

    return res


@router.get("/auth/me")
async def current_user(
    request: Request,
    db_session: AsyncSession = Depends(get_db_session),  # noqa: B008
):
    logger.info("calling get_current_user function to auth user.")
    res = await get_current_user(request, db_session)
    logger.info("get_current_user function return successfully.")

    return res


@router.get("/logout")
async def logout_user(
    request: Request,
    db_session: AsyncSession = Depends(get_db_session),  # noqa: B008
):
    pass
