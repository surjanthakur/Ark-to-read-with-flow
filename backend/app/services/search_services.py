from ..core.tools_provider import web_search_tool


async def search_resources_service(input_query: str):
    query = (input_query or "").strip()

    if not query:
        raise ValueError("Search query cannot be empty.")

    try:
        response = await web_search_tool(query)

    except TimeoutError as exc:
        raise TimeoutError("Search request timed out. Please try again.") from exc
    except OSError as exc:
        raise ConnectionError(
            "Network error while searching for resources. Please try again."
        ) from exc

    search_results = response.get("results", []) if isinstance(response, dict) else []
    resources = []

    for result in search_results:
        if not isinstance(result, dict):
            continue

        title = result.get("title") or "Untitled resource"
        url = result.get("url") or ""
        score = result.get("score", 0)
        content = result.get("content") or ""

        resources.append(
            {
                "title": title,
                "url": url,
                "score": score,
                "content": content,
            }
        )

    resources.sort(key=lambda resource: resource["score"], reverse=True)
    return {"found_resources": resources}
