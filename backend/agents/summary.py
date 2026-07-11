"""
Summary agent: the last content-producing step - compresses everything the
other agents learned into a 10-second-read situation summary and timeline.
"""
from graph.state import CrisisState
from llm.fireworks import fireworks_client
from llm.prompts import SUMMARY_SYSTEM


async def run(state: CrisisState) -> CrisisState:
    fallback = {
        "situation_summary": (
            f"A {state['crisis_type']} has been reported in {state['location']}. "
            f"Current assessed risk is {state.get('risk_level', 'HIGH')}. "
            f"Immediate precautions are recommended while the situation develops."
        ),
        "timeline": [
            "Report received and classified",
            "Live research and risk assessment completed",
            "Action plan and communications drafted",
        ],
    }
    prompt = (
        f"Crisis type: {state['crisis_type']}\nLocation: {state['location']}\n"
        f"Risk: {state.get('risk_level')}\nFindings: {state.get('research_findings', [])}"
    )
    result = await fireworks_client.structured_call(SUMMARY_SYSTEM, prompt, fallback)

    state["situation_summary"] = result.get("situation_summary", fallback["situation_summary"])
    state["timeline"] = result.get("timeline", fallback["timeline"])

    state.setdefault("agent_trace", []).append({"agent": "summary", "status": "done"})
    return state
