"""
Pydantic request/response models shared across the API layer.
"""
from typing import Optional
from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    query: str = Field(..., description="Free-text crisis description, e.g. 'Flood in Mumbai'")
    location_hint: Optional[str] = Field(None, description="Optional explicit location override")
    user_id: Optional[str] = Field(None, description="Optional user id for history association")


class RiskAssessment(BaseModel):
    level: str  # LOW | MODERATE | HIGH | CRITICAL
    score: int  # 0-100
    reasons: list[str]


class CommunicationDraft(BaseModel):
    sms: str
    email_subject: str
    email_body: str


class AgentStepStatus(BaseModel):
    agent: str
    status: str  # pending | running | done | error
    detail: Optional[str] = None


class CrisisReport(BaseModel):
    id: Optional[str] = None
    created_at: Optional[str] = None
    query: str
    crisis_type: str
    location: str
    situation_summary: str
    research_findings: list[str]
    risk: RiskAssessment
    action_plan: list[str]
    emergency_checklist: list[str]
    communication: CommunicationDraft
    timeline: list[str]
    sources: list[str] = []
    agent_trace: list[AgentStepStatus] = []
    geo: Optional[dict] = None
    weather: Optional[dict] = None
    shelters: list[dict] = []


class AnalyzeResponse(BaseModel):
    report: CrisisReport


class TranslateRequest(BaseModel):
    target_language: str

