from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    username: Optional[str] = Field(  # noqa: UP045
        default=None,
        min_length=3,
        max_length=50,
        description="Display name of the user.",
    )
    google_id: Optional[str] = Field(  # noqa: UP045
        default=None,
        min_length=1,
        description="Google account ID for the user.",
    )
    email_id: Optional[EmailStr] = Field(  # noqa: UP045
        default=None,
        description="Primary email address of the user.",
    )
    profile_picture: Optional[str] = Field(  # noqa: UP045
        default=None,
        max_length=500,
        description="URL or path to the user's profile picture.",
    )
