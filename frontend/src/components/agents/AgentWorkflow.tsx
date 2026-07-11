import React from "react";
import type { AgentStepStatus } from "../../types";

const AGENT_META: Record<string, { label: string; role: string }> = {
  planner: { label: "Planner", role: "Classifies the crisis" },
  research: { label: "Research", role: "Gathers live conditions" },
  risk: { label: "Risk", role: "Scores severity" },
  response: { label: "Response", role: "Builds the action plan" },
  communication: { label: "Communication", role: "Drafts messages" },
  summary: { label: "Summary", role: "Compresses the findings" },
  validator: { label: "Validator", role: "Checks for gaps" },
};

function statusColor(status: AgentStepStatus["status"]) {
  switch (status) {
    case "done":
      return "border-risk-low bg-risk-low/10 text-risk-low";
    case "running":
      return "border-signal bg-signal/10 text-signal";
    case "error":
      return "border-risk-critical bg-risk-critical/10 text-risk-critical";
    default:
      return "border-base-600 bg-base-800 text-ink-faint";
  }
}

/**
 * The signature visual of CrisisMind AI: a mission-control style pipeline
 * board. Each node lights up in sequence as the corresponding backend
 * agent runs, making the "agentic" behavior visible rather than hiding it
 * behind a spinner.
 */
export default function AgentWorkflow({ trace }: { trace: AgentStepStatus[] }) {
  return (
    <div className="panel p-5 overflow-x-auto">
      <p className="eyebrow mb-4">Agent pipeline</p>
      <div className="flex items-stretch gap-2 min-w-[720px]">
        {trace.map((step, idx) => {
          const meta = AGENT_META[step.agent] ?? { label: step.agent, role: "" };
          return (
            <React.Fragment key={step.agent}>
              <div
                className={`relative flex-1 rounded-lg border px-3 py-3 transition-colors duration-300 ${statusColor(
                  step.status
                )}`}
              >
                {step.status === "running" && (
                  <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                    <div className="h-full w-1/3 bg-signal/20 animate-scan" />
                  </div>
                )}
                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest">
                    0{idx + 1}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      step.status === "running" ? "bg-signal animate-pulseDot" : "bg-current"
                    }`}
                  />
                </div>
                <p className="relative font-display text-sm font-semibold mt-2">{meta.label}</p>
                <p className="relative text-[11px] text-ink-muted mt-0.5 leading-tight">
                  {meta.role}
                </p>
              </div>
              {idx < trace.length - 1 && (
                <div className="flex items-center">
                  <div className="w-3 h-px bg-base-600" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
