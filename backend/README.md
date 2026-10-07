# LeelyAgent Backend

This README is intentionally scoped to the backend service only. It covers the FastAPI application, auth flow, LLM research pipeline, environment setup, and local development commands.

## Overview

The backend powers the Leely research experience. It handles:

- Google OAuth login and JWT-based session management
- Research requests backed by Gemini and LangGraph
- Web search and content retrieval via Tavily
- Database persistence using SQLModel and PostgreSQL
- API endpoints for frontend integration

## Features

- AI-driven query optimization using Google Gemini
- Multi-step research workflow powered by LangGraph
- Real-time web search with Tavily
- Google OAuth login and secure JWT handling
- Async FastAPI API layer
- SQLModel-based persistence for user and app data

## Architecture

The backend is organized as a service-oriented FastAPI application:

- `app/main.py` initializes the app and registers routes
- `app/routes/` contains HTTP endpoints for authentication and research requests
- `app/services/` contains business logic for auth and agent orchestration
- `app/core/` contains settings, LLM integration, tool providers, and workflow logic
- `app/db/` manages database connection and model definitions
- `app/utils/` contains auth/session helpers and parsing utilities

## Tech Stack

- Python 3.11+
- FastAPI
- SQLModel
- Async SQLAlchemy
- LangChain + LangGraph
- Google Gemini API
- Tavily Search API
- Authlib + JWT
- PostgreSQL-compatible database support

## Prerequisites

Before starting, make sure you have:

- Python 3.11 or newer
- A virtual environment tool such as `venv`
- A PostgreSQL-compatible database URL
- A Google Gemini API key
- A Tavily API key
- Google OAuth credentials

## Installation

From the backend directory:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -e .
```

## Environment Variables

Create a `.env` file in the `backend/` directory using values from `.env.example`.

Required variables:

```env
DB_URL="your db url link"
LOG_LEVEL="add your logs level"
GOOGLE_GEMINI_API_KEY="your gemini api"
TRAVILY_API_KEY="your tavily web search api"
ENVIRONMENT="set your app environment"
APP="set your app name"
VERSION="set your version"
GOOGLE_CLIENT_ID="your google client id"
GOOGLE_CLIENT_SECRET="your google client secret"
SECRET_KEY="your session secret"
JWT_SECRET_KEY="your jwt secret"
FRONTEND_URL="http://localhost:5173"
REDIRECT_URL="http://127.0.0.1:8000/api/v1/google/auth"
```

### Notes

- `DB_URL` should point to your PostgreSQL connection string
- `ENVIRONMENT` is typically `development` or `production`
- `FRONTEND_URL` is used after OAuth redirects back to the client app
- `REDIRECT_URL` should match your Google OAuth callback route
- `SENTRY_URL` is optional; when set to your Sentry project DSN, application logs are sent to Sentry and errors are captured as events

## Running the Backend

Start the app in development mode:

```bash
cd backend
source .venv/bin/activate
fastapi dev app.main:app
```

Or run with Uvicorn directly:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

## API Endpoints

### Health check

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

### Google login

```http
GET /api/v1/google/login
```

Redirects the user to the Google OAuth consent page.

### Google OAuth callback

```http
GET /api/v1/google/auth
```

Validates the Google token, creates or verifies the user, and issues a JWT-backed session for the app.

### Research agent request

```http
POST /api/v1/agent/asks
```

Request body:

```json
{
  "user_query": "Latest trends in AI agents for startups"
}
```

Example response:

```json
{
  "found_resources": [
    {
      "title": "AI agents are changing startup workflows",
      "url": "https://example.com/article",
      "score": 0.91,
      "content": "A concise summary of the article..."
    }
  ]
}
```

## Authentication Flow

The backend supports Google OAuth-based login and JWT cookie sessions.

1. The user visits the Google login route
2. The backend redirects to Google OAuth
3. Google returns the user identity and access token
4. The backend validates the token and fetches profile data
5. The user is created or verified in the database
6. A JWT is generated and stored as an HTTP-only cookie
7. The request is redirected back to the frontend application

## How the Research Flow Works

A research request moves through the following stages:

1. The user sends a natural-language query to the research API
2. The query optimization node uses Gemini to refine and expand the request
3. A LangGraph workflow fans out the optimized queries into search tasks
4. Each query is evaluated with Tavily search
5. Results are normalized and ranked into a list of resources
6. The backend returns the final structured findings to the client

## Project Structure

```text
backend/
├── .env
├── .env.example
├── pyproject.toml
├── README.md
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── llm_provider.py
│   │   ├── logginig.py
│   │   ├── settings.py
│   │   ├── tools_provider.py
│   │   └── langgraph/
│   │       ├── graph.py
│   │       ├── nodes.py
│   │       └── state_graph.py
│   ├── db/
│   │   ├── databse.py
│   │   └── models.py
│   ├── repository/
│   │   └── auth_repo.py
│   ├── routes/
│   │   ├── agent_routes.py
│   │   ├── auth_routes.py
│   │   └── __init__.py
│   ├── schemas/
│   │   ├── llm_req.py
│   │   ├── user_req.py
│   │   └── __init__.py
│   ├── services/
│   │   ├── agent_services.py
│   │   ├── auth_services.py
│   │   └── __init__.py
│   └── utils/
│       ├── auth.py
│       ├── get_db_session.py
│       ├── json_parser.py
│       └── __init__.py
└── .venv/
```

## Testing

The project currently does not include a dedicated automated test suite in the repository structure. For local validation, you can:

- run the server and test the API manually in Swagger UI
- validate endpoints using curl or Postman
- confirm database connectivity and OAuth flow in development mode

Suggested future additions:

- unit tests for the auth flow
- integration tests for the LangGraph workflow
- validation tests for JSON parsing and query optimization

This README is scoped to backend usage only and intentionally excludes frontend setup and client-side documentation.

The frontend is a React + Vite app located in the `frontend/` directory.

Run it with:

```bash
cd frontend
npm install
npm run dev
```

## 🤝 Contributing

Contributions are welcome. For improvements, please:

1. Create a feature branch
2. Make your changes
3. Validate the backend and frontend locally
4. Submit a pull request with a clear description

## 📄 License

MIT
