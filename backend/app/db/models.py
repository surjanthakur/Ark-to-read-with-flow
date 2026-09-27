from datetime import datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


# user table
class User(SQLModel, table=True):
    user_id: UUID = Field(
        default_factory=uuid4,
        title="unique id of the user",
        primary_key=True,
    )
    username: str = Field(
        default=None,
        min_length=3,
        max_length=50,
        title="name of the user",
    )
    google_id: str = Field(
        default=None,
        unique=True,
        title="google id of the user",
    )
    email_id: str = Field(
        default=None,
        unique=True,
        title="email of the user",
    )
    profile_picture: str = Field(
        default=None,
        title="picture of the user",
    )
    created_at: datetime = Field(
        default_factory=datetime.now,
        title="date and time the user was created",
    )
