from uuid import UUID

import httpx
from fastapi import HTTPException, Request, status
from fastapi.responses import HTMLResponse, JSONResponse
from jose import JWTError
from sqlmodel.ext.asyncio.session import AsyncSession

from ..core.logginig import get_logger
from ..db.redis_db import redis_client
from ..repository.auth_repository import (
    create_new_user,
    get_user_by_google_id,
    get_user_by_user_id,
)
from ..schemas.user_req import UserRequest
from ..utils.auth import create_auth_response, create_session, oauth_client

logger = get_logger(__name__)


# authenticate user
async def authenticate_user(
    req: Request,
    db_session: AsyncSession,
) -> HTMLResponse:
    try:

        logger.info("Authentication started.")
        try:
            logger.info("Requesting Google OAuth token authorization.")

            token_info: dict = await oauth_client.google_auth.authorize_access_token(
                req
            )

            logger.info("Google OAuth token authorization succeeded.")

        except JWTError:
            logger.exception("Google OAuth token authorization failed.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Google authentication failed.",
            )

        try:
            user_info_endpoint = "https://www.googleapis.com/oauth2/v2/userinfo"

            headers = {"Authorization": f"Bearer {token_info['access_token']}"}

            async with httpx.AsyncClient() as client:
                logger.info("Requesting user profile from Google.")

                google_response = await client.get(user_info_endpoint, headers=headers)

                google_response.raise_for_status()

            user_info: dict = google_response.json()

            logger.info("Google user profile retrieved successfully.")

        except httpx.HTTPError:
            logger.exception("Failed to retrieve the Google user profile.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Failed to retrieve Google user information.",
            )

        logger.info("Checking OAuth response for user information.")

        user: dict = token_info.get("userinfo")

        if not user:
            logger.warning("Google OAuth response did not include user information.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Google authentication failed.",
            )

        logger.info("Extracting required Google user claims.")

        user_google_id = user.get("sub")
        oauth_provider = user.get("iss")
        user_email = user.get("email")
        user_name = user_info.get("name")
        user_pic = user_info.get("picture")

        logger.info(
            "Google user claims extracted (provider_present=%s, subject_present=%s, email_present=%s).",
            bool(oauth_provider),
            bool(user_google_id),
            bool(user_email),
        )

        # Verifies that the token was actually issued by Google
        logger.info("Validating Google token issuer and subject.")

        if (
            oauth_provider not in ["https://accounts.google.com", "accounts.google.com"]
            and not user_google_id
        ):
            logger.warning("Google user information failed issuer/subject validation.")

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google user information.",
            )
        logger.info("Google issuer and subject validation completed.")
        logger.info("Looking up user by Google account.")

        existing_user = await get_user_by_google_id(
            google_id=user_google_id,
            session=db_session,
        )

        if not existing_user:
            logger.info("No existing user found; creating a new user.")

            new_user = UserRequest(
                username=user_name,
                google_id=user_google_id,
                email_id=user_email,
                profile_picture=user_pic,
            )
            new_user = await create_new_user(new_user, db_session)

            logger.info("New user created successfully✅.")
            session_creation_user_id = new_user.user_id
        else:
            logger.info("Existing user found; creating application session.")
            session_creation_user_id = existing_user.user_id

        # Create session once

        logger.info("Creating application session.")

        new_session_id = await create_session(session_creation_user_id)

        logger.info("Application session created.")

        response = create_auth_response(new_session_id)

        logger.info("Authentication completed successfully✅¯.")
        return response

    except Exception:
        logger.exception("Unexpected authentication error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed.",
        )


# get current session user
async def get_current_user(
    request: Request,
    db_session: AsyncSession,
) -> JSONResponse:
    try:
        session_id = request.cookies.get("oauth_session")

        if not session_id:
            logger.warning("Current user request has no session cookie.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="user is not Authenticated",
            )

        logger.info("searching for current user_id in redis.")
        curr_user_id = await redis_client.get(f"session:{session_id}")

        if not curr_user_id:
            logger.warning("No user ID found in Redis for the current session.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="user is not Authenticated",
            )

        logger.info("searching for current user in database.")
        curr_user = await get_user_by_user_id(UUID(curr_user_id), db_session)

        if not curr_user:
            logger.warning("Current session references a user that does not exist.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="user don't exists login first",
            )

        logger.info("find the current user in db.")
        return JSONResponse(
            content={
                "username": curr_user.username,
                "email": curr_user.email_id,
                "profile_img": curr_user.profile_picture,
            },
            status_code=status.HTTP_200_OK,
            media_type="application/json",
            headers={"is_authenticated": "true"},
        )

    except Exception:
        logger.exception("Unexpected error while retrieving the current user.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="can't authenticate user something went worng!",
        )


# logout session user
async def logout_session_user(request: Request) -> JSONResponse:
    try:
        session_id = request.cookies.get("oauth_session")

        if not session_id:
            logger.warning("Current user request has no session cookie.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="user is not Authenticated",
            )

        logger.info("searching for current user_id in redis.")
        curr_user_id = await redis_client.get(f"session:{session_id}")

        if not curr_user_id:
            logger.warning("No user ID found in Redis for the current session.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="user is not Authenticated",
            )

        await redis_client.delete(f"session:{session_id}")

        response = JSONResponse(
            content={"message": "Logged out"},
            status_code=status.HTTP_200_OK,
            media_type="application/json",
            headers={"is_authenticated": "false"},
        )
        response.delete_cookie(
            key="oauth_session",
            path="/",
            httponly=True,
            secure=False,
            samesite="lax",
        )
        response.status_code = status.HTTP_200_OK
        return response

    except Exception:
        logger.exception("Unexpected error while retrieving the current user.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="something went worng!",
        )
