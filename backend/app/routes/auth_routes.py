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
    endpoints for logging and authenticating users\n
    redirect user to google oauth endpoint /auth/callback.
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
    return await authenticate_user(req=request, db_session=db_session)


@router.get("/auth/me", status_code=status.HTTP_200_OK)
async def current_user(
    request: Request,
    db_session: AsyncSession = Depends(get_db_session),  # noqa: B008
):
    return await get_current_user(request, db_session)


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout_user(request: Request):
    return await logout_session_user(request)
