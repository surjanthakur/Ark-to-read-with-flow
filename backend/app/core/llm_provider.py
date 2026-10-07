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

from ..schemas.llm_req import LLMRequest
from .settings import settings


async def llm_provider(model_validation: LLMRequest) -> str:
    """
    Return LLM response text asynchronously.
    """

    try:
        # config model
        model = ChatGoogleGenerativeAI(
            model=model_validation.model_name,
            api_key=settings.GOOGLE_GEMINI_API_KEY,
            thinking_level=model_validation.thinking_level,
            max_output_tokens=1024,
        )
        # add system and user msg
        combined_system_prompt = f"""{model_validation.system_prompt}

        CURRENT TASK INSTRUCTIONS:{model_validation.task_prompt}
"""

        messages = [
            SystemMessage(content=combined_system_prompt),
            HumanMessage(content=model_validation.user_input),
        ]
        # invoke model
        response = await model.ainvoke(messages)
        # return llm response
        return response.text

    except GoogleRateLimitError as error:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="The model is temporarily rate-limited. Please try again later.",
        ) from error

    except GoogleAPIError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The model is temporarily unavailable. Please try again later.",
        ) from error

    except GoogleContextOverflowError as error:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail="The request is too large for the model context window.",
        ) from error

    except GoogleModelNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested model was not found.",
        ) from error

    except GooglePermissionDeniedError as error:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The model request was denied.",
        ) from error

    except GoogleInvalidRequestError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The model request was invalid.",
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The model request failed unexpectedly.",
        ) from error
