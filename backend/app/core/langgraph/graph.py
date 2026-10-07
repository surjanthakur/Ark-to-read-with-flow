from langgraph.graph import END, START

from .nodes import query_optimizer_node, resource_search_node
from .state_graph import GRAPH_BUILDER

# NODES
GRAPH_BUILDER.add_node(
    "query_optimizer", query_optimizer_node
)  # to optmize query into multiple queries

GRAPH_BUILDER.add_node(
    "resource_search", resource_search_node
)  # to fetch resources for each optimized queries

# EDGES
GRAPH_BUILDER.add_edge(START, "query_optimizer")
GRAPH_BUILDER.add_edge("query_optimizer", "resource_search")
GRAPH_BUILDER.add_edge("resource_search", END)


# COMPILED GRAPH
COMPILED_GRAPH = GRAPH_BUILDER.compile()
