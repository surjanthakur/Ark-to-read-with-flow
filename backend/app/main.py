import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .core.logginig import get_logger, setup_logging
from .core.settings import settings
from .db.databse import create_db_tables
from .db.redis_db import check_redis_connection, close_redis_connection
from .routes import agent_routes, auth_routes

setup_logging()


logger = get_logger(__name__)


# to perform app startup and shutdown task
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await create_db_tables()
        await check_redis_connection()
        yield
    finally:
        await close_redis_connection()


app = FastAPI(
    lifespan=lifespan,
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="API for the Lily-Agent project.",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/openapi.json",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["is_authenticated"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="oauth_state",
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
app.include_router(router=agent_routes.router, prefix="/api/v1/agent")
app.include_router(router=auth_routes.router, prefix="/api/v1/google")


# health check route
@app.get("/health", status_code=200, tags=["health check"])
def health_checks_route():
    return {"status": "ok"}
