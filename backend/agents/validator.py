"""
Validator agent: final safety/completeness pass over the assembled report
before it's returned to the user. Purely defensive - fills in obviously
missing fields rather than blocking the response.
"""
from graph.state import CrisisState
from llm.fireworks import fireworks_client
from llm.prompts import VALIDATOR_SYSTEM


async def run(state: CrisisState) -> CrisisState:
    fallback = {"valid": True, "corrections": []}
    snapshot = {
        "crisis_type": state.get("crisis_type"),
        "location": state.get("location"),
        "risk_level": state.get("risk_level"),
        "action_plan": state.get("action_plan"),
        "emergency_checklist": state.get("emergency_checklist"),
    }
    result = await fireworks_client.structured_call(VALIDATOR_SYSTEM, str(snapshot), fallback)

    state["valid"] = result.get("valid", True)
    state["corrections"] = result.get("corrections", [])

    # Defensive fill-ins in case any upstream agent produced empty fields.
    state.setdefault("action_plan", ["Stay alert to official advisories."])
    state.setdefault("emergency_checklist", ["Keep a charged phone and emergency contacts ready."])
    state.setdefault("research_findings", ["No additional live findings were available."])
    state.setdefault("sources", [])

    state.setdefault("agent_trace", []).append({"agent": "validator", "status": "done"})
    return state
