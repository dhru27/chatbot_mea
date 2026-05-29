# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is the MEA (Mechanical Engineering Association) Website for IIT Bombay — a full-stack web application with a React/Vite frontend and a FastAPI backend.

| Service | Port | Start Command |
|---------|------|---------------|
| Frontend (Vite) | 8080 | `npm run dev` (from repo root) |
| Backend (FastAPI) | 8000 | `source backend/venv/bin/activate && cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` |

### Running commands

- **Lint**: `npm run lint` (pre-existing warnings/errors from `@typescript-eslint/no-explicit-any` are known)
- **Frontend tests**: `npm test` (Vitest + jsdom; 2 pre-existing test failures in `RegisterPage.test.tsx` and `DynamicForm.test.tsx`)
- **Backend tests**: `cd backend && source venv/bin/activate && pytest --cov=app -v -k "not email" tests/ --cov-report=term-missing` (some tests error due to missing `app.services.email_service` module — this is a pre-existing gap)
- **Build**: `npm run build`

### Gotchas

- The backend requires a `.env` file at `backend/.env`. For tests with mocked Supabase, a minimal `.env` with dummy values suffices (see `backend/env.template`). Without it, the FastAPI app fails to start because `pydantic-settings` validation fails.
- The backend Python venv lives at `backend/venv/`. Always activate it before running backend commands.
- `python3.12-venv` must be installed at the system level (`sudo apt-get install -y python3.12-venv`) before creating the venv — the base image does not include it.
- The Vite dev server logs an error about `MEAFreshieBooklet.html` referencing a missing `.mjs` file in `public/`. This is a non-blocking issue; the main SPA routes work fine.
- The backend uses Supabase as a hosted DB (no local Postgres needed). For real data operations, valid `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets are required.
- The chatbot feature requires `ANTHROPIC_API_KEY` in the backend `.env`; without it the chatbot endpoint returns 503 but all other features work.
