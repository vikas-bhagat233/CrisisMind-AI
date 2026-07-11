"""
WebSocket endpoint that streams agent-by-agent progress while a crisis
analysis runs, so the frontend's live pipeline panel can light up each
agent in real time instead of waiting for one big response.
"""
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from agents import communication, planner, research, response, risk, summary, validator
from database import crud
from graph.state import CrisisState
from api.reports import _state_to_report

logger = logging.getLogger("crisismind.api.websocket")
router = APIRouter()

_PIPELINE = [
    ("planner", planner.run),
    ("research", research.run),
    ("risk", risk.run),
    ("response", response.run),
    ("communication", communication.run),
    ("summary", summary.run),
    ("validator", validator.run),
]


@router.websocket("/ws/analyze")
async def ws_analyze(websocket: WebSocket):
    await websocket.accept()
    try:
        payload = await websocket.receive_json()
        query = payload.get("query", "")
        location_hint = payload.get("location_hint")

        state: CrisisState = {"query": query, "location_hint": location_hint, "agent_trace": []}

        for name, node in _PIPELINE:
            await websocket.send_json({"type": "agent_status", "agent": name, "status": "running"})
            state = await node(state)
            await websocket.send_json({"type": "agent_status", "agent": name, "status": "done"})

        report = _state_to_report(state, query)
        saved = crud.save_report(report.model_dump(mode="json"))
        report.id = saved.get("id")
        report.created_at = saved.get("created_at")

        await websocket.send_json({"type": "complete", "report": report.model_dump(mode="json")})
    except WebSocketDisconnect:
        logger.info("client disconnected during analysis")
    except Exception as exc:  # noqa: BLE001
        logger.exception("ws_analyze failed")
        await websocket.send_json({"type": "error", "detail": str(exc)})
    finally:
        await websocket.close()
