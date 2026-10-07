import asyncio

from tavily import AsyncTavilyClient

from .settings import settings

Travily_lient = AsyncTavilyClient(api_key=settings.TRAVILY_API_KEY)

PREFERRED_DOMAINS = [
    "medium.com",
    "substack.com",
    "reddit.com",
    "theconversation.com",
    "aeon.co",
    "arxiv.org",
    "semanticscholar.org",
    "researchgate.net",
    "academia.edu",
]

EXCLUDED_DOMAINS = [
    "youtube.com",
    "instagram.com",
    "tiktok.com",
]


async def _search_one(query: str) -> dict:
    response = await Travily_lient.search(
        query=query,
        max_results=1,
        timeout=20,
        language="en",
        search_depth="ultra-fast",
        include_domains_mode="prefer",
        include_usage=False,
        include_answer=False,
        include_favicon=False,
        include_images=False,
        include_raw_content=False,
        include_generated_markdown=False,
        include_published_date=True,
        filter_by_language=False,
        include_domains=PREFERRED_DOMAINS,
        exclude_domains=EXCLUDED_DOMAINS,
    )

    return response


async def web_search_tool(input_queries: list[str]) -> list[dict]:
    """
    Run multiple Tavily searches concurrently and
    return unique ranked results.
    """
    # serch for all queries in one event loop
    travily_results = asyncio.gather(
        *[_search_one(query) for query in input_queries], return_exceptions=True
    )

    all_resource = []

    # add all the resource to the list
    for result in travily_results:
        if isinstance(result, Exception):
            continue

        resource: dict = result.get("results", [])
        all_resource.append(
            {
                "title": resource.get("title"),
                "url": resource.get["url"],
                "score": resource.get("score", 0.0),
                "content": resource.get("content"),
            }
        )

    all_resource.sort(
        key=lambda item: item["score"],
        reverse=True,
    )
    return all_resource
