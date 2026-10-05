import time
from contextlib import asynccontextmanager

import logfire
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.sessions import SessionMiddleware

from .core.logginig import get_logger, setup_logging
from .core.settings import settings
from .db.databse import create_db_tables
from .db.redis_db import check_redis_connection, close_redis_connection
from .routes import agent_routes, auth_routes
from .utils.rate_limiter import rate_limiter

logger = get_logger(__name__)


# to perform app startup and shutdown task
@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ARG001
    try:
        setup_logging()
        await create_db_tables()
        await check_redis_connection()
        yield
    finally:
        await close_redis_connection()


app = FastAPI(
    lifespan=lifespan,
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="API for Ark Agent.",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# FastAPI Cloud injects this when the Logfire integration is connected.
logfire.instrument_fastapi(app)

app.state.limiter = rate_limiter

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGINS],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="oauth_state",
    https_only=settings.HTTPONLY,
    same_site=settings.SAMESITE,
    max_age=settings.SESSION_EXPIRY,
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["ark-agent-delta.vercel.app", "arkagent.fastapicloud.dev"],
)


# Logging time taken for each api request
@app.middleware("http")
async def log_response_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"Request: {request.url.path} completed in {process_time:.4f} seconds.")
    return response


# include routes to app
app.include_router(router=agent_routes.router, prefix=f"{settings.API_V1_STR}/agent")
app.include_router(router=auth_routes.router, prefix=f"{settings.API_V1_STR}/google")


# health check route
@app.get("/api/v1/health", status_code=status.HTTP_200_OK, tags=["health_check route"])
@rate_limiter.limit("10/minute")
def health_checks_route(request: Request):  # noqa: ARG001
    return {"status": "ok"}
