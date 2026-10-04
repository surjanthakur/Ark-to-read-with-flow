from fastapi import HTTPException, status
from langgraph.checkpoint.base import EmptyChannelError
from langgraph.errors import (
    EmptyInputError,
    GraphBubbleUp,
    GraphDrained,
    GraphInterrupt,
    GraphRecursionError,
    InvalidUpdateError,
    NodeCancelledError,
    NodeTimeoutError,
    ParentCommand,
    TaskNotFound,
)

from ..core.langgraph.graph import COMPILED_GRAPH
from ..core.logginig import get_logger

logger = get_logger(__name__)


async def call_langgraph_agent(query: str) -> dict:
    try:

        logger.info("invoking langgraph workflow...")
        response = await COMPILED_GRAPH.ainvoke(
            {
                "topic": query,
                "found_resources": [],
                "optimized_query": [],
            }
        )

        logger.info("invoked langgraph workflow...")

        return response.get("found_resources", [])

    except (EmptyInputError, EmptyChannelError, InvalidUpdateError) as exc:
        logger.warning("invalid LangGraph input or state: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The agent request could not be processed.",
        )

    except TaskNotFound as exc:
        logger.warning("LangGraph task was not found: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The agent task was not found.",
        )

    except GraphRecursionError as exc:
        logger.warning("LangGraph recursion limit reached: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_508_LOOP_DETECTED,
            detail="The agent exceeded its recursion limit.",
        )

    except NodeTimeoutError as exc:
        logger.warning("LangGraph node timed out: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="The agent timed out while processing the request.",
        )

    except (
        GraphBubbleUp,
        GraphDrained,
        GraphInterrupt,
        NodeCancelledError,
        ParentCommand,
    ) as exc:
        logger.warning("LangGraph workflow stopped: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The agent workflow was stopped before completion.",
        ) from exc

    except Exception as exc:
        logger.exception("LangGraph agent call exception")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while running the agent.",
        ) from exc
