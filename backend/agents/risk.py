"""
Risk agent: turns research findings into a structured severity read-out
(level + numeric score + reasons) that colors every downstream decision.
"""
from graph.state import CrisisState
from llm.fireworks import fireworks_client
from llm.prompts import RISK_SYSTEM


async def run(state: CrisisState) -> CrisisState:
    fallback = {
        "level": "HIGH",
        "score": 70,
        "reasons": state.get("research_findings", ["Limited information available"])[:3],
    }
    prompt = (
        f"Crisis type: {state['crisis_type']}\nLocation: {state['location']}\n"
        f"Findings: {state.get('research_findings', [])}"
    )
    result = await fireworks_client.structured_call(RISK_SYSTEM, prompt, fallback)

    state["risk_level"] = result.get("level", fallback["level"])
    state["risk_score"] = int(result.get("score", fallback["score"]))
    state["risk_reasons"] = result.get("reasons", fallback["reasons"])

    state.setdefault("agent_trace", []).append({"agent": "risk", "status": "done"})
    return state
