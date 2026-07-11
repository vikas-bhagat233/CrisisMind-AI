"""
Shared state object passed between LangGraph nodes. Each agent reads what
it needs and writes its own slice, so the graph stays easy to reason about.
"""
from typing import Optional, TypedDict


class CrisisState(TypedDict, total=False):
    query: str
    location_hint: Optional[str]

    # planner
    crisis_type: str
    location: str
    is_natural_disaster: bool
    specialists_needed: list[str]

    # research
    research_findings: list[str]
    sources: list[str]
    geo: Optional[dict]
    weather: Optional[dict]

    # risk
    risk_level: str
    risk_score: int
    risk_reasons: list[str]

    # response
    action_plan: list[str]
    emergency_checklist: list[str]

    # communication
    sms: str
    email_subject: str
    email_body: str

    # summary
    situation_summary: str
    timeline: list[str]

    # validator
    valid: bool
    corrections: list[str]

    # trace
    agent_trace: list[dict]
