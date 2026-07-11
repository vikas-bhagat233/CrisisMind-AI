"""
Builds the LangGraph StateGraph that wires the seven agents into the
CrisisMind pipeline:

    planner -> research -> risk -> response -> communication -> summary -> validator

Each node is a plain async function that mutates and returns CrisisState.
A single compiled graph instance is reused across requests.
"""
from langgraph.graph import StateGraph, END

from agents import communication, planner, research, response, risk, summary, validator
from graph.state import CrisisState


def build_graph():
    graph = StateGraph(CrisisState)

    graph.add_node("planner", planner.run)
    graph.add_node("research", research.run)
    graph.add_node("risk", risk.run)
    graph.add_node("response", response.run)
    graph.add_node("communication", communication.run)
    graph.add_node("summary", summary.run)
    graph.add_node("validator", validator.run)

    graph.set_entry_point("planner")
    graph.add_edge("planner", "research")
    graph.add_edge("research", "risk")
    graph.add_edge("risk", "response")
    graph.add_edge("response", "communication")
    graph.add_edge("communication", "summary")
    graph.add_edge("summary", "validator")
    graph.add_edge("validator", END)

    return graph.compile()


_compiled_graph = None


def get_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_graph()
    return _compiled_graph


async def run_pipeline(query: str, location_hint: str | None = None) -> CrisisState:
    graph = get_graph()
    initial_state: CrisisState = {
        "query": query,
        "location_hint": location_hint,
        "agent_trace": [],
    }
    final_state = await graph.ainvoke(initial_state)
    return final_state
