# CrisisMind AI - API Reference

Base URL (local): `http://localhost:8000`
All REST endpoints are prefixed with `/api`.

## `GET /api/health`
Liveness check.
```json
{ "status": "ok", "service": "CrisisMind AI backend" }
```

## `POST /api/analyze`
Runs the full seven-agent pipeline synchronously and returns the finished
report.

Request body:
```json
{ "query": "There is a flood in Mumbai. What should I do?", "location_hint": null }
```

Response: `{ "report": CrisisReport }` — see `backend/schemas/models.py`
for the full `CrisisReport` shape (situation summary, risk, action plan,
checklist, communication draft, timeline, sources, agent trace).

## `GET /api/reports?limit=50`
Returns `{ "reports": CrisisReport[] }`, most recent first.

## `GET /api/reports/{id}`
Returns `{ "report": CrisisReport }` or `404` if not found.

## `GET /api/reports/{id}/pdf`
Streams a PDF export of the report (`application/pdf`).

## `WS /ws/analyze`
Streaming variant of `/api/analyze`. Client sends
`{ "query": "...", "location_hint": null }` once connected, then receives:

```json
{ "type": "agent_status", "agent": "planner", "status": "running" }
{ "type": "agent_status", "agent": "planner", "status": "done" }
...
{ "type": "complete", "report": { ... } }
```

or, on failure: `{ "type": "error", "detail": "..." }`.
