from operator import add
from typing import Annotated, TypedDict

from langgraph.graph import StateGraph


class AgentState(TypedDict):
    topic: str  # main user query
    optimized_queries: list[str]  # agent optimized queries
    found_resources: Annotated[
        list[dict], add
    ]  # resource founded with the optimized queries


GRAPH_BUILDER = StateGraph(AgentState)
