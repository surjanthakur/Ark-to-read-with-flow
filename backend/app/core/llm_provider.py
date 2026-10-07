from time import perf_counter

from fastapi import HTTPException, status
from langchain.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai.chat_models import (
    GoogleAPIError,
    GoogleContextOverflowError,
    GoogleInvalidRequestError,
    GoogleModelNotFoundError,
    GooglePermissionDeniedError,
    GoogleRateLimitError,
)

from ..core.logginig import get_logger
from ..schemas.llm_req import LLMRequest
from .settings import settings

logger = get_logger(__name__)


async def llm_provider(model_validation: LLMRequest) -> str:
    """
    Return LLM response text asynchronously.
    """
    request_started_at = perf_counter()

    stage = "initializing model"

    logger.info("Starting Gemini request (model=%s)", model_validation.model_name)

    try:
        # config model
        model = ChatGoogleGenerativeAI(
            model=model_validation.model_name,
            api_key=settings.GOOGLE_GEMINI_API_KEY,
            max_output_tokens=model_validation.max_output_token,
            temperature=model_validation.temperature,
            thinking_budget=model_validation.thinking_budget,
        )

        messages = [
            SystemMessage(content=model_validation.task_prompt),
            HumanMessage(content=model_validation.user_input),
        ]

        stage = "invoking model"

        response = await model.ainvoke(messages)

        result = response.text

        logger.info(
            "Gemini request completed (model=%s, elapsed_seconds=%.3f, "
            "response_chars=%d)",
            model_validation.model_name,
            perf_counter() - request_started_at,
            len(result),
        )
        return result

    except GoogleRateLimitError as error:
        logger.exception(
            "Gemini request failed (category=rate_limit, stage=%s, model=%s, "
            "elapsed_seconds=%.3f)",
            stage,
            model_validation.model_name,
            perf_counter() - request_started_at,
        )
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="The model is temporarily rate-limited. Please try again later.",
        ) from error

    except GoogleAPIError as error:
        logger.exception(
            "Gemini request failed (category=api_error, stage=%s, model=%s, "
            "elapsed_seconds=%.3f)",
            stage,
            model_validation.model_name,
            perf_counter() - request_started_at,
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The model is temporarily unavailable. Please try again later.",
        ) from error

    except GoogleContextOverflowError as error:
        logger.exception(
            "Gemini request failed (category=context_overflow, stage=%s, model=%s, "
            "elapsed_seconds=%.3f)",
            stage,
            model_validation.model_name,
            perf_counter() - request_started_at,
        )
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail="The request is too large for the model context window.",
        ) from error

    except GoogleModelNotFoundError as error:
        logger.exception(
            "Gemini request failed (category=model_not_found, stage=%s, model=%s, "
            "elapsed_seconds=%.3f)",
            stage,
            model_validation.model_name,
            perf_counter() - request_started_at,
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested model was not found.",
        ) from error

    except GooglePermissionDeniedError as error:
        logger.exception(
            "Gemini request failed (category=permission_denied, stage=%s, model=%s, "
            "elapsed_seconds=%.3f)",
            stage,
            model_validation.model_name,
            perf_counter() - request_started_at,
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The model request was denied.",
        ) from error

    except GoogleInvalidRequestError as error:
        logger.exception(
            "Gemini request failed (category=invalid_request, stage=%s, model=%s, "
            "elapsed_seconds=%.3f)",
            stage,
            model_validation.model_name,
            perf_counter() - request_started_at,
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The model request was invalid.",
        ) from error

    except Exception as error:
        logger.exception(
            "Gemini request failed unexpectedly (stage=%s, model=%s, "
            "elapsed_seconds=%.3f)",
            stage,
            model_validation.model_name,
            perf_counter() - request_started_at,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The model request failed unexpectedly.",
        ) from error
