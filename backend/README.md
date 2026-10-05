# Ark Agent

Ark Agent is an AI-powered research assistant built with FastAPI, LangGraph, Google Gemini, and Tavily. It accepts a user query, optimizes it into focused search prompts, runs a multi-step research workflow, and returns ranked web resources with titles, URLs, relevance scores, and content snippets.

## ✨ Features

- AI-driven query optimization using Google Gemini
- Multi-agent research flow powered by LangGraph
- Real-time web search with Tavily
- Google OAuth login and JWT-based session handling
- Async FastAPI backend with structured API routes
- SQLModel-based persistence for user data
- Frontend-ready architecture with React + Vitec

## 🏗️ Architecture

The backend is organized around a service-oriented FastAPI application:

- `app/main.py` initializes the FastAPI app and registers routes
- `app/routes/` contains HTTP endpoints for auth and research requests
- `app/services/` contains business logic for auth and LangGraph orchestration
- `app/core/` handles settings, LLM integration, tool providers, and LangGraph workflow
- `app/db/` manages the database connection and model definitions
- `app/utils/` contains JWT/OAuth utilities and JSON parsing helpers

## 🛠️ Tech Stack

- Python 3.11+
- FastAPI
- SQLModel
- Async SQLAlchemy
- LangChain + LangGraph
- Google Gemini API
- Tavily Search API
- Authlib + JWT
- PostgreSQL/async database support via SQLModel
- React + Vite frontend

## 📋 Prerequisites

Before starting, make sure you have:

- Python 3.11 or newer
- A virtual environment tool such as `venv`
- A PostgreSQL-compatible database URL
- Google Gemini API key
- Tavily API key
- Google OAuth credentials

## 🚀 Installation

From the backend folder:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -e .
```

If you want to run the frontend separately:

```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory using the values from `.env.example`.

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

- `DB_URL` should point to your database connection string
- `ENVIRONMENT` is usually `development` or `production`
- `FRONTEND_URL` is used after OAuth login redirects the user back to the frontend app
- `REDIRECT_URL` should match your Google OAuth callback endpoint

## ▶️ Running the Project

Start the backend server:

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

## 📡 API Documentation

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

This redirects the user to Google OAuth for authentication.

### Google OAuth callback

```http
GET /api/v1/google/auth
```

This validates the Google token, creates a user record if needed, and creates a JWT cookie for the frontend.

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

## 🔐 Authentication

The project supports Google OAuth-based login and JWT cookie sessions.

Flow:

1. User clicks the Google login route
2. Backend redirects to Google OAuth
3. Google returns user identity and access token
4. Backend validates the token and fetches user profile data
5. User is created or verified in the database
6. A JWT is generated and stored as an HTTP-only cookie
7. User is redirected to the frontend

## 🧠 How It Works

A research request moves through the following stages:

1. The user sends a natural-language query to the research API
2. The query optimization node uses Gemini to rewrite and expand the topic into more specific queries
3. A LangGraph workflow fans out the optimized queries to the resource search node
4. Each query is evaluated with Tavily search
5. Results are normalized into a list of ranked resources
6. The backend returns structured search results to the frontend

## 📁 Project Structure

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
└── frontend/
    ├── package.json
    ├── src/
    └── public/
```

## 🧪 Testing

The project currently does not include a dedicated test suite in the repository structure. For local validation, you can:

- run the server and test the API manually in Swagger UI
- validate endpoints using curl or Postman
- check database connectivity and OAuth flow in development mode

Suggested future additions:

- unit tests for auth flow
- integration tests for the LangGraph workflow
- validation tests for JSON parsing and query optimization

## 🚀 Frontend

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
