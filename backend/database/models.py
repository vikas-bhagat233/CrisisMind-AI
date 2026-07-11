"""
SQL-facing shape of a stored report row (mirrors database/schema.sql).
Kept separate from the API-facing pydantic schema in schemas/models.py so
storage concerns don't leak into the API contract.
"""
from typing import TypedDict


class ReportRow(TypedDict, total=False):
    id: str
    created_at: str
    query: str
    crisis_type: str
    location: str
    payload: dict
