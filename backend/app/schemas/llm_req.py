from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class LLMRequest(BaseModel):

    model_config = ConfigDict(str_strip_whitespace=True)

    user_input: Optional[str] = Field(  # noqa: UP045
        min_length=2,
        max_length=2000,
        description="The user's request",
    )
    model_name: Literal[
        "gemini-3.5-flash-lite",
        "gemini-3.5-flash",
    ] = Field(description="The language model to use")

    thinking_level: Literal["low", "medium", "high"] = Field(
        description="The model's reasoning level"
    )
    task_prompt: str = Field(
        min_length=1,
        max_length=10000,
        description="task Instructions for the model",
    )
    temperature: Optional[int] = Field(  # noqa: UP045
        title="temp for the llm", default=0
    )
    thinking_level: Literal["low", "medium", "high"]
