from datetime import timedelta
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


async def create_session(user_id: UUID) -> str:
    """Create a short-lived Redis-backed auth session for a user.

    Args:
        user_id: The authenticated user UUID.

    Returns:
        A random session ID that is stored in Redis and later used as a cookie value.
    """
    try:
        session_id = str(uuid4())
        await redis_client.set(
            name=f"session:{session_id}",
            value=str(user_id),
            ex=SESSION_EXPIRY,
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


def create_auth_response(session_id: str) -> HTMLResponse:
    """Return a small HTML page that notifies the frontend login succeeded.

    The page posts a success message to the opener window and closes itself,
    while also setting an HttpOnly session cookie for the browser.

    Args:
        session_id: The Redis-backed session identifier to store in the cookie.

    Returns:
        An HTML response that triggers the frontend login-success flow.

    Raises:
        HTTPException: If cookie creation fails due to OAuth-related issues.
    """
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
            httponly=settings.HTTPONLY,
            secure=settings.SECURE,
            samesite=settings.SAMESITE,
            path="/",
        )
        response.status_code = status.HTTP_201_CREATED
        return response

    except OAuthError:
        logger.exception("oauth error while setting cookies")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="google oauth failed try again!",
        )
