from fastapi import APIRouter, status
from pydantic import BaseModel, Field

from ..core.logginig import get_logger
from ..services.agent_services import call_langgraph_agent

router = APIRouter(tags=["agent"])

logger = get_logger(__name__)


class AgentReq(BaseModel):
    user_query: str = Field(title="user query", min_length=1, max_length=100)


class AgentResponse(BaseModel):
    found_resources: list[dict]


# Route to get agent response
@router.post("/asks", status_code=status.HTTP_200_OK, response_model=AgentResponse)
async def get_agent_response(requests: AgentReq) -> dict:
    res = await call_langgraph_agent(query=requests.user_query)
    return {"found_resources": res}
