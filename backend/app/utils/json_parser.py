import json
from json.decoder import JSONDecodeError

from ..core.logginig import get_logger

logger = get_logger(__name__)


def parse_optimized_queries(result: str) -> list[str]:

    if result is None:
        raise ValueError("Query optimizer response is empty")

    cleaned_result = str(result).strip()

    if not cleaned_result:
        raise ValueError("Query optimizer response is empty")

    try:
        if cleaned_result.startswith("```"):
            lines = cleaned_result.splitlines()
            cleaned_result = "\n".join(lines[1:-1]).strip()

            if cleaned_result.startswith("json"):
                cleaned_result = cleaned_result[4:].lstrip()

        if cleaned_result.startswith("queries ="):
            cleaned_result = cleaned_result.partition("=")[2].strip()

        data = json.loads(cleaned_result)
        queries = data if isinstance(data, list) else data.get("queries", [])

        if not isinstance(queries, list) or not all(
            isinstance(query, str) and query.strip() for query in queries
        ):
            raise ValueError("Query optimizer response must contain a list of strings")

        return [query.strip() for query in queries]

    except (JSONDecodeError, TypeError, AttributeError) as exc:
        logger.exception("JSON parser failed while decoding optimizer response")
        raise ValueError("Could not parse query optimizer response") from exc
