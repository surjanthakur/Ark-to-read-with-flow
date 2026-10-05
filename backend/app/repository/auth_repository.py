"""Repository layer for user authentication and user lookup operations."""

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from ..db.models import User
from ..schemas.user_req import UserRequest


# FIND user
async def get_user_by_google_id(google_id: str, session: AsyncSession) -> User | None:
    """Fetch a user by Google ID.

    Args:
        google_id: Unique Google account identifier.
        session: Async database session.

    Returns:
        The matching User record, or None if not found.
    """
    statement = select(User).where(User.google_id == google_id)
    result = await session.exec(statement)

    return result.one_or_none()


# async def get_user_by_user_id(user_id: UUID, session: AsyncSession) -> User | None:
#     """Fetch a user by internal UUID.

#     Args:
#         user_id: Unique user identifier.
#         session: Async database session.

#     Returns:
#         The matching User record, or None if not found.
#     """
#     statement = select(User).where(User.user_id == user_id)
#     result = await session.exec(statement)

#     return result.one_or_none()


# CREATE user
async def create_new_user(user: UserRequest, session: AsyncSession) -> User:
    """Create a new user record from the incoming request payload.

    Args:
        user: Validated user request data.
        session: Async database session.

    Returns:
        The newly created user record.
    """
    new_user = User(
        google_id=user.google_id,
        email_id=user.email_id,
        username=user.username,
        profile_picture=user.profile_picture,
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    return new_user
