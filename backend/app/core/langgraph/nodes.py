from pathlib import Path

from langgraph.types import Send

from ...schemas.llm_req import LLMRequest
from ...utils.json_parser import parse_optimized_queries
from ..llm_provider import llm_provider
from ..logginig import get_logger
from ..tools_provider import web_search
from .state_graph import AgentState

logger = get_logger(__name__)


QUERY_OPTIMIZER_SKILL = (
    Path(__file__).resolve().parent.parent / "prompts" / "query_optimizer_skill.md"
)


# optimize user queries
async def query_optimizer_node(state: AgentState) -> dict:
    """
    Expands the user's topic into multiple focused search queries.
    """
    try:
        input_query = state["topic"]

        # validating llm config's
        validation_config = LLMRequest(
            user_input=input_query,
            model_name="gemini-3.5-flash-lite",
            thinking_level="high",
            system_prompt=QUERY_OPTIMIZER_SKILL.read_text(encoding="utf-8"),
        )

        logger.info("Calling llm...")

        res = await llm_provider(validation_config)

        logger.info("llm returned repsonse successfully...")

        logger.info("Loading optimizer result's into JSON...")

        queries = parse_optimized_queries(res)

        logger.info("getting list of queries from loaded json data...")

    except Exception:
        logger.exception("Query optimizer call failed...")
        raise

    logger.info("Updating graph state...")
    return {"optimized_queries": queries}


# send query one by one to resource_search node
def fan_out_query_node(state: AgentState):
    """
    send optmized list of queries one by one to reosurce_search node
    """
    queries = state.get("optimized_queries")

    if queries:
        return [Send("resource_search", {"query": query}) for query in queries]

    return [Send("resource_search", {"query": state.get("topic")})]


# find resource based on query
async def resource_search_node(state: dict) -> dict:
    """
    return structured dict source {title , url , score , content}
    """
    try:

        query = state["query"]

        logger.info("executing Travily api...")

        response = await web_search(query)

        logger.info("api executed successfully...")

        source = [
            {
                "title": result["title"],
                "url": result["url"],
                "score": result["score"],
                "content": result["content"],
            }
            for result in response.get("results", [])
        ]
        logger.info("updating found_resources list")
        return {"found_resources": source}

    except Exception:
        logger.exception("reosurce search call failed...")
        raise
