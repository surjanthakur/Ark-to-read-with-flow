from uuid import UUID, uuid4

from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import HTTPException, status
from fastapi.responses import HTMLResponse
from redis.exceptions import RedisError, TimeoutError

from ..core.logginig import get_logger
from ..core.settings import settings
from ..db.redis_db import redis_client

logger = get_logger(__name__)

"""Utilities for Google OAuth session creation and browser auth response handling."""

# OAuth Setup
oauth_client = OAuth()

oauth_client.register(
    name="google_auth",
    project_id=settings.PROJECT_ID,
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    authorize_url=settings.AUTHORIZE_URL,
    authorize_params=None,
    access_token_url=settings.ACCESS_TOKEN_URL,
    access_token_params=None,
    refresh_token_url=None,
    authorize_state=settings.JWT_SECRET_KEY,
    redirect_uri=settings.AUTH_REDIRECT_URL,
    jwks_uri=settings.JWKS_URL,
    client_kwargs={"scope": "openid profile email"},
)


# CREATING REDIS SESSION
async def create_session(user_id: UUID, username: str, email: str) -> str:
    """Create a short-lived Redis-backed auth session for a user."""
    try:
        session_id = str(uuid4())
        session_key = f"session:{session_id}"
        await redis_client.hset(
            name=session_key,
            mapping={
                "user_id": str(user_id),
                "username": username,
                "email": email,
            },
        )
        await redis_client.expire(
            name=session_key,
            time=settings.SESSION_EXPIRY,
        )

        return session_id

    except TimeoutError:
        logger.exception("Redis timed out while creating an auth session.")
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Session creation timed out.",
        )

    except RedisError:
        logger.exception("Redis failed while creating an auth session.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Session service is temporarily unavailable.",
        )


# SETTING COOKIE
def create_auth_response(session_id: str) -> HTMLResponse:
    """Return a small HTML page that notifies the frontend login succeeded."""
    try:
        response = HTMLResponse(
            content="""
        <html>
            <body>
                <script>
                    window.opener.postMessage(
                        { type: "google-login-success" },
                        "https://ark-to-read-with-flow.vercel.app"
                    );
                    window.close();
                </script>
            </body>
        </html>
        """,
            status_code=status.HTTP_201_CREATED,
        )

        response.set_cookie(
            key="session",
            value=session_id,
            max_age=settings.SESSION_EXPIRY,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            domain=settings.BACKEND_DOMAIN,
        )
        return response

    except OAuthError:
        logger.exception("oauth error while setting cookies")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="google oauth failed try again!",
        )
