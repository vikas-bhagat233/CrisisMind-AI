import asyncio
import json
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from database import crud
from graph.workflow import run_pipeline
from llm.fireworks import fireworks_client
from schemas.models import (
    AnalyzeRequest,
    AnalyzeResponse,
    CommunicationDraft,
    CrisisReport,
    RiskAssessment,
    TranslateRequest,
)
from tools.pdf import render_report_pdf

logger = logging.getLogger("crisismind.api.reports")
router = APIRouter(tags=["reports"])


def _generate_mock_shelters(lat: float, lng: float) -> list[dict]:
    return [
        {"name": "Central Emergency Shelter", "lat": lat + 0.008, "lng": lng + 0.012},
        {"name": "Red Cross Relief Base", "lat": lat - 0.011, "lng": lng - 0.005},
        {"name": "Community Safe Haven", "lat": lat + 0.005, "lng": lng - 0.015},
    ]


def _state_to_report(state: dict, query: str) -> CrisisReport:
    geo = state.get("geo")
    shelters = []
    if geo and geo.get("latitude") is not None and geo.get("longitude") is not None:
        shelters = _generate_mock_shelters(geo["latitude"], geo["longitude"])

    return CrisisReport(
        query=query,
        crisis_type=state.get("crisis_type", "other"),
        location=state.get("location", "unspecified"),
        situation_summary=state.get("situation_summary", ""),
        research_findings=state.get("research_findings", []),
        risk=RiskAssessment(
            level=state.get("risk_level", "HIGH"),
            score=state.get("risk_score", 70),
            reasons=state.get("risk_reasons", []),
        ),
        action_plan=state.get("action_plan", []),
        emergency_checklist=state.get("emergency_checklist", []),
        communication=CommunicationDraft(
            sms=state.get("sms", ""),
            email_subject=state.get("email_subject", ""),
            email_body=state.get("email_body", ""),
        ),
        timeline=state.get("timeline", []),
        sources=state.get("sources", []),
        agent_trace=state.get("agent_trace", []),
        geo=geo,
        weather=state.get("weather"),
        shelters=shelters,
    )


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest):
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="query must not be empty")

    final_state = await run_pipeline(payload.query, payload.location_hint)
    report = _state_to_report(final_state, payload.query)

    saved = crud.save_report(report.model_dump(mode="json"))
    report.id = saved.get("id")
    report.created_at = saved.get("created_at")

    return AnalyzeResponse(report=report)


@router.get("/reports")
async def list_reports(limit: int = 50):
    return {"reports": crud.list_reports(limit=limit)}


@router.get("/reports/{report_id}")
async def get_report(report_id: str):
    report = crud.get_report(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="report not found")
    return {"report": report}


@router.get("/reports/{report_id}/pdf")
async def export_report_pdf(report_id: str):
    report = crud.get_report(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="report not found")
    pdf_bytes = render_report_pdf(report)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="crisismind-{report_id}.pdf"'},
    )


async def _translate_string(text: str, target_lang: str) -> str:
    if not text or not text.strip():
        return text
    system_prompt = (
        f"You are a translation assistant. Translate the following text into {target_lang}. "
        f"Respond ONLY with a valid JSON object matching this schema: {{\"translated\": \"<translation>\"}}."
    )
    user_prompt = json.dumps({"text": text})
    fallback = {"translated": f"[{target_lang}] " + text}
    res = await fireworks_client.structured_call(system_prompt, user_prompt, fallback)
    return res.get("translated", fallback["translated"])


async def _translate_list(items: list[str], target_lang: str) -> list[str]:
    if not items:
        return items
    system_prompt = (
        f"You are a translation assistant. Translate the following list of strings into {target_lang}. "
        f"Respond ONLY with a valid JSON object matching this schema: "
        f"{{\"translated\": [\"<translation1>\", \"<translation2>\"]}}."
    )
    user_prompt = json.dumps({"items": items})
    fallback = {"translated": [f"[{target_lang}] " + x for x in items]}
    res = await fireworks_client.structured_call(system_prompt, user_prompt, fallback)
    return res.get("translated", fallback["translated"])


@router.post("/reports/{report_id}/translate", response_model=CrisisReport)
async def translate_report(report_id: str, payload: TranslateRequest):
    report = crud.get_report(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="report not found")

    target_lang = payload.target_language

    results = await asyncio.gather(
        _translate_string(report.get("situation_summary", ""), target_lang),
        _translate_list(report.get("research_findings", []), target_lang),
        _translate_list(report.get("action_plan", []), target_lang),
        _translate_list(report.get("emergency_checklist", []), target_lang),
        _translate_string(report.get("communication", {}).get("sms", ""), target_lang),
        _translate_string(report.get("communication", {}).get("email_subject", ""), target_lang),
        _translate_string(report.get("communication", {}).get("email_body", ""), target_lang),
        _translate_list(report.get("timeline", []), target_lang),
    )

    translated_report = dict(report)
    translated_report["situation_summary"] = results[0]
    translated_report["research_findings"] = results[1]
    translated_report["action_plan"] = results[2]
    translated_report["emergency_checklist"] = results[3]
    translated_report["communication"] = {
        "sms": results[4],
        "email_subject": results[5],
        "email_body": results[6],
    }
    translated_report["timeline"] = results[8] if len(results) > 8 else results[7]

    return CrisisReport(**translated_report)


@router.get("/feeds")
async def get_feeds():
    feeds = []
    # Fetch USGS Earthquakes
    try:
        import httpx
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson")
            if resp.status_code == 200:
                features = resp.json().get("features", [])[:5]
                for f in features:
                    props = f.get("properties", {})
                    feeds.append({
                        "id": f.get("id"),
                        "title": props.get("title", "Earthquake"),
                        "location": props.get("place", "Unknown location"),
                        "source": "USGS",
                        "severity": "HIGH" if props.get("mag", 0) >= 5.0 else "MODERATE",
                        "timestamp": props.get("time"),
                        "link": props.get("url"),
                        "query": f"There is an earthquake of magnitude {props.get('mag')} in {props.get('place')}."
                    })
    except Exception as exc:  # noqa: BLE001
        logger.warning("Failed to fetch USGS feed: %s", exc)

    # Fallback simulated warnings if empty or offline
    if not feeds:
        now_ms = int(datetime.now(timezone.utc).timestamp() * 1000)
        feeds = [
            {
                "id": "mock-1",
                "title": "Severe Flood Warning",
                "location": "Miami, Florida",
                "source": "NOAA (Simulated)",
                "severity": "CRITICAL",
                "timestamp": now_ms - 1800000,
                "link": "https://www.noaa.gov",
                "query": "There is a severe flood in Miami Florida with rising water levels."
            },
            {
                "id": "mock-2",
                "title": "Wildfire Expansion Alert",
                "location": "Valparaiso, Chile",
                "source": "GDACS (Simulated)",
                "severity": "HIGH",
                "timestamp": now_ms - 3600000,
                "link": "https://www.gdacs.org",
                "query": "Wildfire spreading rapidly near Valparaiso Chile."
            },
            {
                "id": "mock-3",
                "title": "Category 3 Cyclone Heading",
                "location": "Queensland, Australia",
                "source": "BOM (Simulated)",
                "severity": "HIGH",
                "timestamp": now_ms - 7200000,
                "link": "http://www.bom.gov.au",
                "query": "Cyclone approaching Queensland Australia coast."
            }
        ]
    return {"feeds": feeds}


