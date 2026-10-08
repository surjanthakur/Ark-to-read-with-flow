# Leely backend

The backend is a Python 3.11+ API built with FastAPI. It exposes a health check
and a web-resource search endpoint backed by Tavily search api. This guide covers local
setup, configuration, the current source layout, and contribution basics.

## Backend layout

```text
backend/
├── .env.example              # Safe starter template for local configuration
├── .python-version           # Python version selected by uv (3.11)
├── pyproject.toml            # Project dependencies and tool configuration
├── uv.lock                   # Pinned dependency resolution
└── app/
    ├── main.py               # FastAPI app, middleware, and health route
    ├── core/
    │   ├── settings.py       # Loads settings from backend/.env
    │   ├── logginig.py       # Logging and optional Sentry setup
    │   └── tools_provider.py # Tavily client and search configuration
    ├── routes/
    │   └── search_routes.py  # Search HTTP endpoint
    ├── schema/
    │   └── search_query_model.py # Search request/response validation
    ├── services/
    │   └── search_services.py    # Search orchestration and result mapping
    └── utils/
        └── rate_limiter.py  # Shared request rate limiter
```

The `.venv/`, `.env`, and generated `app.log` are local files and should not be
committed. There is currently no database or authentication flow in this
backend.

## Prerequisites

- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- Python 3.11 or newer
- A Tavily API key for the search endpoint

`uv` reads the Python version from `.python-version`, creates the backend
virtual environment, and installs the exact dependencies recorded in
`uv.lock`.

## Configure the environment

Run these commands from the repository root for a fresh checkout:

```sh
cd backend
uv sync
test -f .env || cp .env.example .env
```

Edit `backend/.env` and replace the Tavily placeholder with a key from your
Tavily account. Keep real API keys and Sentry DSNs private; `.env` is ignored by
Git. Do not overwrite an existing `.env` if it already contains your local
settings.

| Variable           | Required | Purpose                                                                                       |
| ------------------ | -------- | --------------------------------------------------------------------------------------------- |
| `ENVIRONMENT`      | Yes      | Runtime environment name, for example `development` or `production`.                          |
| `APP_NAME`         | Yes      | Application name used by FastAPI and Sentry metadata.                                         |
| `VERSION`          | Yes      | Application version used by FastAPI and Sentry metadata.                                      |
| `LOG_LEVEL`        | Yes      | Python logging level, for example `INFO` or `DEBUG`.                                          |
| `API_V1_STR`       | Yes      | API prefix used for the OpenAPI schema and search router (default `/api/v1`).                 |
| `FRONTEND_ORIGINS` | Yes      | One allowed frontend origin for CORS, such as `http://localhost:5173`; do not include a path. |
| `TRAVILY_API_KEY`  | Yes      | API key used by the Tavily search client.                                                     |
| `SENTRY_URL`       | No       | Sentry DSN. Leave empty to disable sending events to Sentry during local development.         |

The settings loader reads `backend/.env` regardless of the current working
directory. Process environment variables can also provide settings and take
precedence over values in the file.

## Run locally

From `backend/`:

```sh
uv run fastapi dev
```

The FastAPI CLI uses the entrypoint configured in `pyproject.toml` and starts
the development server at <http://localhost:8000> with reload enabled. You can
also launch Uvicorn directly:

```sh
uv run uvicorn app.main:app --reload
```

Use `uv run ...` for project commands so they run in the managed environment
without manually activating `.venv`. To refresh dependencies after changing
`pyproject.toml`, run:

```sh
uv lock
uv sync
```

## API

In development, interactive API documentation is available at
<http://localhost:8000/docs>. The OpenAPI document is at
<http://localhost:8000/api/v1/openapi.json>. Documentation endpoints are
disabled when `ENVIRONMENT=production`.

### Health check

```http
GET /api/v1/health
```

Example response:

```json
{ "status": "ok" }
```

The health check is limited to 10 requests per minute per client IP.

### Search for resources

```http
POST /api/v1/agent/asks
Content-Type: application/json
```

Request body:

```json
{ "user_query": "Database design articles" }
```

`user_query` must contain 1–100 characters. The endpoint calls Tavily and
returns normalized search results:

```json
{
  "found_resources": [
    {
      "title": "Example resource",
      "url": "https://example.com/article",
      "score": 0.9,
      "content": "A short extract from the resource."
    }
  ]
}
```

The search endpoint is limited to 20 requests per minute per client IP and
requires a working `TRAVILY_API_KEY`.

Quick local health check:

```sh
curl -i http://localhost:8000/api/v1/health
```

## Run tests

From `backend/`, run the service and route tests with:

```sh
uv run pytest
```

The tests mock the Tavily client, so they do not make external requests or need
a live Tavily key. Application settings still need to be configured as
described above.

## Contributing

1. Fork the repository and create a focused branch for your change.
2. Make changes in `backend/` for API behavior, configuration, or backend
   documentation. Keep secrets out of commits and update `.env.example` when
   adding or changing configuration.
3. Run the API locally and check the health endpoint. For search changes, use
   the interactive docs or a local request with your own Tavily key.
4. Describe the change and the checks you ran in your pull request.

Add backend tests under `test/` and keep external services mocked so the test
suite remains reliable and safe to run locally and in CI.
