# Leely Frontend

Leely's frontend is a React + Vite application that provides the user-facing interface for searching, discovering learning resources, and viewing the AI-generated results.

## Overview

This app is built with:

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios for API calls
- React Hook Form and Toast notifications

The frontend talks to the FastAPI backend and displays curated resources for user queries such as learning topics, concepts, or research areas.

## Prerequisites

Before running the app, make sure you have the following installed:

- Node.js 20+
- npm or Bun
- A running backend instance for Leely

## Environment setup

1. Copy the example environment file:

```bash
cd frontend
cp .env.example .env
```

2. Update the backend URL in `.env`:

```env
VITE_BACKEND_BASE_URL="http://localhost:8000"
```

This should point to the backend API base URL. If your backend runs somewhere else, replace it accordingly.

## Installation

```bash
cd frontend
bun install
```

## Available scripts

```bash
bun run dev
```

Starts the Vite development server.

```bash
bun run build
```

Builds the app for production into the `dist` folder.

```bash
bun run preview
```

Serves the production build locally for preview.

```bash
bun run lint
```

Runs ESLint to check the codebase for common issues.

## Running the app

```bash
cd frontend
bun run dev
```

Then open the local Vite URL in your browser, typically:

```text
http://localhost:5173
```

## Project structure

```text
frontend/
├── public/                   # static assets
├── src/
│   ├── api/                  # API client and request helpers
│   ├── components/           # reusable UI pieces
│   ├── context/              # app context like theme state
│   ├── layout/              # layout wrappers
│   ├── pages/               # route pages
│   ├── assets/              # local images and media
│   ├── index.css            # global styles
│   ├── main.jsx             # app entry point
│   └── ...
├── .env.example             # example environment config
├── eslint.config.js        # ESLint config
├── index.html              # Vite HTML entry
├── package.json            # scripts and dependencies
├── vite.config.js          # Vite config
├── bun.lock                # Bun lockfile
└── README.md               # frontend documentation
```

## Main app flow

- The app loads the home screen and optional marketing/landing pages
- The dashboard lets users enter a learning topic or query
- A request is sent to the backend via the API client
- Results are displayed as resources with titles, links, descriptions, and metadata
- Chat history is stored in `localStorage` under `lily_chats`

## API usage

The frontend uses an Axios client configured in `src/api/BaseClient.js` and sends requests to:

```text
${VITE_BACKEND_BASE_URL}/api/v1
```

The main agent request is sent through the `CallAgent` helper in `src/api/agent.api.js`.

## Notes

- Keep secrets in `.env` files only
- Do not commit real API keys or production URLs
- The frontend expects the backend to be running before making requests
- For local development, the backend URL should usually be `http://localhost:8000`

## Related projects

- Backend: `../backend`
- Root project: `../README.md`
