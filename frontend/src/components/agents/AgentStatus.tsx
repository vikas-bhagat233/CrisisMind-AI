import React from "react";

export default function AgentStatus({ status }: { status: "pending" | "running" | "done" | "error" }) {
  const map: Record<string, string> = {
    pending: "text-ink-faint",
    running: "text-signal",
    done: "text-risk-low",
    error: "text-risk-critical",
  };
  return <span className={`text-xs font-mono uppercase ${map[status]}`}>{status}</span>;
}
