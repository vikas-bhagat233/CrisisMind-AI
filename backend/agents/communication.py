"""
Communication agent: drafts ready-to-send messages (SMS + email) so the
person doesn't have to compose them under stress.
"""
from graph.state import CrisisState
from llm.fireworks import fireworks_client
from llm.prompts import COMMUNICATION_SYSTEM


async def run(state: CrisisState) -> CrisisState:
    fallback = {
        "sms": f"I am safe. There is a {state['crisis_type']} situation in {state['location']}. Will update you within the hour.",
        "email_subject": f"Update regarding {state['crisis_type']} in {state['location']}",
        "email_body": (
            f"Dear Manager,\n\nDue to an ongoing {state['crisis_type']} situation in "
            f"{state['location']}, I may be unable to travel/work as normal today. "
            f"I am currently safe and will keep you updated.\n\nRegards"
        ),
    }
    prompt = f"Crisis type: {state['crisis_type']}\nLocation: {state['location']}\nRisk: {state.get('risk_level')}"
    result = await fireworks_client.structured_call(COMMUNICATION_SYSTEM, prompt, fallback)

    state["sms"] = result.get("sms", fallback["sms"])
    state["email_subject"] = result.get("email_subject", fallback["email_subject"])
    state["email_body"] = result.get("email_body", fallback["email_body"])

    state.setdefault("agent_trace", []).append({"agent": "communication", "status": "done"})
    return state
