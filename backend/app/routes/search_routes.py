from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, Field

from ..services.search_services import search_resources_service
from ..utils.rate_limiter import rate_limiter

router = APIRouter(tags=["web search"])


class SearchRequest(BaseModel):
    user_query: str = Field(
        title="User query",
        description="A question or topic to search for web resources.",
        min_length=1,
        max_length=100,
        examples=["hey i want to read databse design articles."],
    )


class SearchResponse(BaseModel):
    found_resources: list[dict] = Field(
        description="Resources discovered by searching the query on the web."
    )


@router.post(
    "/asks",
    status_code=status.HTTP_200_OK,
    response_model=SearchResponse,
    summary="Search for resources",
    description=(
        "Searches the web for the supplied query and returns matching resources. "
        "The query must contain between 1 and 100 characters."
    ),
    response_description="Resources found by web search.",
)
@rate_limiter.limit("20/minute")
async def search_resources(
    requests: SearchRequest,
    request: Request,  # noqa: ARG001
) -> dict:

    try:
        return await search_resources_service(input_query=requests.user_query)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc

    except TimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=str(exc),
        ) from exc

    except (ConnectionError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
