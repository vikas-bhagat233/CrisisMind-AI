"""
Response agent: converts crisis type + risk into a concrete, prioritized
action plan and a short preparedness checklist.
"""
from graph.state import CrisisState
from llm.fireworks import fireworks_client
from llm.prompts import RESPONSE_SYSTEM

_CYBER_FALLBACK_ACTIONS = [
    "Disconnect infected devices from the network immediately",
    "Do not pay any ransom demand",
    "Preserve system logs and evidence for investigators",
    "Notify your IT/security team and change privileged credentials",
    "Contact your national CERT or equivalent authority",
    "Inform employees and pause access to shared systems",
]
_DISASTER_FALLBACK_ACTIONS = [
    "Move to higher/safer ground away from the hazard",
    "Charge your phone and any power banks now",
    "Pack essential medicines and a basic first-aid kit",
    "Store clean drinking water and non-perishable food",
    "Avoid roads or areas flagged as closed or unsafe",
    "Keep emergency contacts and ID documents ready to hand",
]


async def run(state: CrisisState) -> CrisisState:
    is_cyber = state["crisis_type"] == "cyberattack"
    fallback = {
        "action_plan": _CYBER_FALLBACK_ACTIONS if is_cyber else _DISASTER_FALLBACK_ACTIONS,
        "emergency_checklist": [
            "Emergency contact list saved offline",
            "Backup power / battery bank charged",
            "Important documents backed up or physically secured",
            "Meeting point agreed with family/team",
        ],
    }
    prompt = (
        f"Crisis type: {state['crisis_type']}\nLocation: {state['location']}\n"
        f"Risk level: {state.get('risk_level')}\nFindings: {state.get('research_findings', [])}"
    )
    result = await fireworks_client.structured_call(RESPONSE_SYSTEM, prompt, fallback)

    state["action_plan"] = result.get("action_plan", fallback["action_plan"])
    state["emergency_checklist"] = result.get("emergency_checklist", fallback["emergency_checklist"])

    state.setdefault("agent_trace", []).append({"agent": "response", "status": "done"})
    return state
