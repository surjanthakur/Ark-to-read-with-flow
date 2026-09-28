from datetime import timedelta
from uuid import UUID, uuid4

from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from ..core.logginig import get_logger
from ..core.settings import settings
from ..db.redis_db import redis_client
from ..services.auth_services import get_current_user
from ..utils.get_db_session import get_db_session

logger = get_logger(__name__)

# OAuth Setup
oauth_client = OAuth()

oauth_client.register(
    name="google_auth",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    refresh_token_url=None,
    authorize_state=settings.JWT_SECRET_KEY,
    redirect_uri=settings.AUTH_REDIRECT_URL,
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
    client_kwargs={"scope": "openid profile email"},
)


SESSION_EXPIRY = timedelta(minutes=1440)


async def require_authenticated_user(
    request: Request,
    db_session: AsyncSession = Depends(get_db_session),  # noqa: B008
) -> None:
    await get_current_user(request, db_session)


async def create_session(user_id: UUID):
    session_id = str(uuid4())
    await redis_client.set(
        name=f"session:{session_id}",
        value=str(user_id),
        ex=SESSION_EXPIRY,
    )

    return session_id


def create_auth_response(
    session_id: str,
) -> HTMLResponse:
    try:
        response = HTMLResponse(content="""
        <html>
            <body>
                <script>
                    window.opener.postMessage(
                        { type: "google-login-success" },
                        "http://localhost:5173"
                    );
                    window.close();
                </script>
            </body>
        </html>
        """)

        response.set_cookie(
            key="oauth_session",
            value=session_id,
            max_age=int(SESSION_EXPIRY.total_seconds()),
            httponly=True,
            secure=False,
            samesite="lax",
            path="/",
        )

        return response

    except OAuthError:
        logger.exception("oauth error while setting cookies")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="google oauth failed try again!",
        )
