# CrisisMind AI - Deployment

## Local (Docker Compose)
```bash
cp backend/.env.example backend/.env   # fill in your API keys
docker compose up --build
```
Frontend: http://localhost:5173 · Backend: http://localhost:8000/docs

## Frontend → Vercel
`deployment/vercel.json` builds `frontend/` and serves `frontend/dist`
as a single-page app.

## Backend → Render
`deployment/render.yaml` defines a Python web service that runs
`uvicorn main:app` from `backend/`. Set `FIREWORKS_API_KEY`,
`TAVILY_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_KEY` as secret env
vars in the Render dashboard.

## Database → Supabase
Run `database/schema.sql` in the Supabase SQL editor to create the
`reports` table before pointing the backend at it.

## Nginx (self-hosted/combined)
`deployment/nginx.conf` shows a reverse-proxy config that serves the built
frontend and proxies `/api/` and `/ws/` to the backend container.
