from datetime import timedelta
from uuid import UUID, uuid4

from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import status
from fastapi.responses import HTMLResponse

from ..core.logginig import get_logger
from ..core.settings import settings
from ..db.redis_db import redis_client

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

                console.log("Popup: sending success message");

                    window.opener.postMessage(
                        { type: "google-login-success" },
                        "http://localhost:5173"
                    );
                    
                    console.log("Popup: closing");

                    window.close();
                </script>
            </body>
        </html>
        """)

        response.set_cookie(
            key="session",
            value=session_id,
            httponly=True,
            secure=False,
            samesite="lax",
        )

        return response

    except OAuthError as err:
        html = f"""
        <html>
        <body>
          <script>
            if (window.opener) {{
              window.opener.postMessage(
                {{ type: 'google-login-error', error: '{err!s}' }},
                'http://localhost:5173'
              );
              window.close();
            }}
          </script>
          <p>Login failed! try again?</p>
        </body>
        </html>
        """
        return HTMLResponse(content=html, status_code=status.HTTP_400_BAD_REQUEST)
