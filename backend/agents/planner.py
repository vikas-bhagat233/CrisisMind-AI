"""
Planner agent: the entry point of the graph. Reads the raw user message and
decides what kind of crisis this is, where it's happening, and which
downstream specialists are relevant.
"""
from graph.state import CrisisState
from llm.fireworks import fireworks_client
from llm.prompts import PLANNER_SYSTEM


async def run(state: CrisisState) -> CrisisState:
    fallback = {
        "crisis_type": "other",
        "location": state.get("location_hint") or "unspecified",
        "is_natural_disaster": True,
        "specialists_needed": ["research", "risk", "response", "communication", "summary"],
    }
    result = await fireworks_client.structured_call(
        PLANNER_SYSTEM, state["query"], fallback
    )

    state["crisis_type"] = result.get("crisis_type", fallback["crisis_type"])
    state["location"] = state.get("location_hint") or result.get("location", fallback["location"])
    state["is_natural_disaster"] = result.get("is_natural_disaster", True)
    state["specialists_needed"] = result.get("specialists_needed", fallback["specialists_needed"])

    state.setdefault("agent_trace", []).append({"agent": "planner", "status": "done"})
    return state
