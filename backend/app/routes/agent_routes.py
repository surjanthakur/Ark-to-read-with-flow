from fastapi import APIRouter, Request, status
from pydantic import BaseModel, Field

from ..core.logginig import get_logger
from ..services.agent_services import call_langgraph_agent
from ..utils.rate_limiter import rate_limiter

router = APIRouter(tags=["agent"])

logger = get_logger(__name__)


class AgentReq(BaseModel):
    user_query: str = Field(
        title="User query",
        description="A question or topic for the research agent to investigate.",
        min_length=1,
        max_length=100,
        examples=["hey i want to read databse design articles."],
    )


class AgentResponse(BaseModel):
    found_resources: list[dict] = Field(
        description="Resources discovered by the agent while researching the query."
    )


@router.post(
    "/asks",
    status_code=status.HTTP_200_OK,
    response_model=AgentResponse,
    summary="Ask the research agent",
    description=(
        "Submits a question to the research workflow and returns the resources "
        "found. The query must contain between 1 and 100 characters."
    ),
    response_description="Resources found by the research agent.",
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "The agent could not process the supplied query."
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "The requested agent task was not found."
        },
        status.HTTP_409_CONFLICT: {
            "description": "The agent workflow stopped before completion."
        },
        508: {"description": "The agent exceeded its recursion limit."},
        status.HTTP_504_GATEWAY_TIMEOUT: {
            "description": "The agent timed out while processing the query."
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "An unexpected error occurred while running the agent."
        },
    },
)
@rate_limiter.limit("1/minute")
async def get_agent_response(
    requests: AgentReq,
    request: Request,
) -> dict:
    res = await call_langgraph_agent(query=requests.user_query)
    return {"found_resources": res}
