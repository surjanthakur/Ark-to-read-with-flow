# Ark Frontend

This is the frontend for the Ark app. It is a React + Vite app that helps users sign in, ask questions, and view the best research resources found by the backend.

## What this app does

- Shows the landing page
- Lets users log in with Google
- Sends user questions to the backend
- Displays research results and resource links
- Keeps the user session active using cookies
- Works with the backend API

## Tech stack

- React
- Vite
- JavaScript
- React Router
- Axios
- Tailwind CSS
- React Toastify

## Requirements

Before starting, make sure you have:

- Node.js installed
- bun installed
- The backend running
- A valid backend URL in your environment variables

## Installation

Go to the frontend folder and install the dependencies:

```bash
cd frontend
bun install
```

## Environment variables

Create a `.env` file inside the `frontend/` folder.

Add this variable:

```env
VITE_BACKEND_BASE_URL=http://127.0.0.1:8000
```

This tells the frontend where the backend is running.

## Run the app

Start the frontend in development mode:

```bash
cd frontend
bun run dev

```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Main flow

1. User opens the homepage
2. User logs in with Google
3. Frontend opens the backend OAuth login flow
4. User comes back to the app after login
5. User types a question in the dashboard
6. Frontend sends that question to the backend
7. Backend returns research results
8. Frontend shows the results on the page

## Project structure

```text
frontend/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── layout/
│   ├── pages/
│   ├── main.jsx
│   ├── index.css
│   └── App.jsx
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html
└── README.md
```

## Useful scripts

```bash
npm run dev
```

Runs the app in local development mode.

```bash
npm run build
```

Builds the project for production.

```bash
npm run preview
```

Shows the production build locally.

```bash
npm run lint
```

Checks the code for lint issues.

## Notes

- The frontend depends on the backend being available.
- Google login is handled through the backend OAuth route.
- The app uses cookies for user sessions.
- Questions typed in the dashboard are sent to `/api/v1/agent/asks`.

This README is written in simple English and focuses only on the frontend.
