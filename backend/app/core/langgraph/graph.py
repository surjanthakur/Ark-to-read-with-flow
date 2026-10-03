from langgraph.graph import END, START

from .nodes import fan_out_query_node, query_optimizer_node, resource_search_node
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
GRAPH_BUILDER.add_conditional_edges("query_optimizer", fan_out_query_node)
GRAPH_BUILDER.add_edge("resource_search", END)


# COMPILED GRAPH
COMPILED_GRAPH = GRAPH_BUILDER.compile()
