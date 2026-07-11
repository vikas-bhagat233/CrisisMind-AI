import React from "react";
import type { AgentStepStatus } from "../../types";

export default function AgentCard({ step }: { step: AgentStepStatus }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md bg-base-800 border border-base-600/60">
      <span className="text-sm text-ink capitalize">{step.agent}</span>
      <span className="text-[11px] font-mono uppercase text-ink-muted">{step.status}</span>
    </div>
  );
}
