from pathlib import Path

from ...schemas.llm_req import LLMRequest
from ...utils.json_parser import parse_optimized_queries
from ..llm_provider import llm_provider
from ..logginig import get_logger
from ..tools_provider import web_search_tool
from .state_graph import AgentState

logger = get_logger(__name__)


QUERY_OPTIMIZER_SKILL = (
    Path(__file__).resolve().parents[3]
    / ".agents"
    / "skills"
    / "query-optimizer"
    / "SKILL.md"
)


# optimize user queries
async def query_optimizer_node(state: AgentState) -> dict:
    """
    Expands the user's topic into multiple focused search queries.
    """
    input_query = state.get("topic", "").strip()

    try:
        validation_config = LLMRequest(
            user_input=input_query,
            model_name="gemini-3.5-flash",
            thinking_level="high",
            task_prompt=QUERY_OPTIMIZER_SKILL.read_text(encoding="utf-8"),
        )

        res = await llm_provider(validation_config)

        logger.info("llm returned response successfully...")

        logger.info("Loading optimizer results into JSON...")

        queries = parse_optimized_queries(res)

        logger.info("getting list of queries from loaded json data...")

        if not queries:
            logger.warning(
                "Query optimizer returned no queries for input: %s", input_query
            )
            return {"optimized_queries": [input_query]}

    except Exception:
        logger.exception("Query optimizer call failed; falling back to original topic")
        return {"optimized_queries": [input_query]}

    else:
        logger.info("Updating graph state...")
        return {"optimized_queries": queries}


# find resource based on query
async def resource_search_node(state: AgentState) -> dict:
    """
    return structured dict source {title , url , score , content}
    """
    try:
        queries = state["optimized_queries"]

        logger.info("executing Travily req api...")

        founded_resources = await web_search_tool(queries)

        logger.info("executed Travily successfully")
        logger.info("updating found_resources list")

        return {"found_resources": founded_resources}

    except Exception:
        logger.exception("reosurce search call failed...")
        raise
