# CrisisMind AI - Agent Prompts

All prompts live in `backend/llm/prompts.py` as plain constants so they can
be tuned without touching agent control flow. Every agent is instructed to
respond with **strict JSON only** so `backend/llm/fireworks.py` can parse
it directly - if parsing fails, or no API key is configured, the calling
agent's own deterministic fallback (defined alongside each agent in
`backend/agents/`) is used instead, so a bad model response never crashes
the pipeline.

| Agent | Prompt constant | Produces |
|---|---|---|
| Planner | `PLANNER_SYSTEM` | crisis_type, location, specialists_needed |
| Research | `RESEARCH_SYSTEM` | findings, sources |
| Risk | `RISK_SYSTEM` | level, score, reasons |
| Response | `RESPONSE_SYSTEM` | action_plan, emergency_checklist |
| Communication | `COMMUNICATION_SYSTEM` | sms, email_subject, email_body |
| Summary | `SUMMARY_SYSTEM` | situation_summary, timeline |
| Validator | `VALIDATOR_SYSTEM` | valid, corrections |
