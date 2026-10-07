from pathlib import Path

from langgraph.types import Send

from ...schemas.llm_req import LLMRequest
from ...utils.json_parser import parse_optimized_queries
from ..llm_provider import llm_provider
from ..logginig import get_logger
from ..system_prompt import LEELY_DEFAULT_SYSTEM_PROMPT
from ..tools_provider import web_search
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

    if not input_query:
        logger.warning("Query optimizer received an empty topic")
        return {"optimized_queries": []}

    try:
        validation_config = LLMRequest(
            user_input=input_query,
            model_name="gemini-3.5-flash",
            thinking_level="high",
            task_prompt=QUERY_OPTIMIZER_SKILL.read_text(encoding="utf-8"),
            system_prompt=LEELY_DEFAULT_SYSTEM_PROMPT,
            thinking_budget=8190,
            temperature=0,
            max_output_token=1025,
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
