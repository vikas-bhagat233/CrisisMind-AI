# CrisisMind AI - Architecture

## Overview

CrisisMind AI turns a single free-text crisis description into a full,
structured response: research, risk score, action plan, ready-to-send
messages, and a summary - produced by seven specialist agents orchestrated
with LangGraph.

## Request flow

1. **Frontend** (`frontend/`) opens a WebSocket to `/ws/analyze` (falling
   back to `POST /api/analyze` if sockets are unavailable) with the user's
   query.
2. **Backend** (`backend/`) runs a compiled LangGraph `StateGraph`
   (`backend/graph/workflow.py`) through seven nodes in sequence:

   ```
   planner -> research -> risk -> response -> communication -> summary -> validator
   ```

3. Each node is one file under `backend/agents/`. Agents call:
   - `backend/llm/fireworks.py` for LLM reasoning (Fireworks AI, OpenAI-compatible
     chat completions API), with a deterministic mock fallback when no API
     key is configured, so the app is always demoable offline.
   - `backend/tools/tavily.py` for live web search.
   - `backend/tools/geocoder.py` / `weather.py` for free, keyless location
     and weather grounding (Open-Meteo).
4. The assembled `CrisisReport` is persisted via `backend/database/crud.py`
   (Supabase if configured, otherwise an in-memory store for local/demo use)
   and streamed back to the frontend.
5. The frontend's `AgentWorkflow` component lights up each pipeline node as
   its `agent_status` event arrives, making the multi-agent behavior visible
   rather than hiding it behind a single spinner.

## Why LangGraph

The crisis pipeline is a fixed sequence with a clear producer/consumer
relationship between steps (research feeds risk, risk feeds response,
etc). LangGraph's `StateGraph` models exactly that: one shared, typed state
object (`backend/graph/state.py`) threaded through named nodes with
explicit edges - easy to extend later with conditional branches (e.g. skip
Communication for pure cyberattacks) without restructuring the whole
pipeline.

## Graceful degradation

Every external integration (Fireworks, Tavily, Supabase) has a safe,
deterministic fallback:
- No `FIREWORKS_API_KEY` → mock JSON responses shaped exactly like a real
  completion, so downstream agents never see malformed input.
- No `TAVILY_API_KEY` → mock advisory/weather-bulletin search results.
- No Supabase credentials → reports are kept in an in-process list for the
  life of the backend, so History/Dashboard still work locally.

This means the whole app runs and is fully clickable with zero API keys,
and gets progressively "real" as keys are added.
