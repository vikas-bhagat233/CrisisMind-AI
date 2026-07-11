import React, { createContext, useCallback, useContext, useState } from "react";
import type { AgentName, AgentStepStatus, CrisisReport } from "../types";
import { AGENT_PIPELINE } from "../types";
import { analyze as analyzeRest } from "../services/api";
import { runLiveAnalysis } from "../services/websocket";

interface AnalysisContextValue {
  isRunning: boolean;
  agentTrace: AgentStepStatus[];
  report: CrisisReport | null;
  error: string | null;
  runAnalysis: (query: string, locationHint?: string) => void;
  reset: () => void;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

function initialTrace(): AgentStepStatus[] {
  return AGENT_PIPELINE.map((agent) => ({ agent, status: "pending" }));
}

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [agentTrace, setAgentTrace] = useState<AgentStepStatus[]>(initialTrace());
  const [report, setReport] = useState<CrisisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setAgentTrace(initialTrace());
    setReport(null);
    setError(null);
  }, []);

  const runAnalysis = useCallback((query: string, locationHint?: string) => {
    setIsRunning(true);
    setError(null);
    setReport(null);
    setAgentTrace(initialTrace());

    let usedFallback = false;

    const close = runLiveAnalysis(query, locationHint, (event) => {
      if (event.type === "agent_status") {
        setAgentTrace((prev) =>
          prev.map((step) =>
            step.agent === event.agent ? { ...step, status: event.status } : step
          )
        );
      } else if (event.type === "complete") {
        setReport(event.report);
        setIsRunning(false);
      } else if (event.type === "error") {
        if (usedFallback) return;
        usedFallback = true;
        // WebSocket path failed (e.g. proxy blocks it) - fall back to REST.
        analyzeRest(query, locationHint)
          .then((r) => {
            setReport(r);
            setAgentTrace(
              (r.agent_trace && r.agent_trace.length > 0
                ? r.agent_trace
                : initialTrace().map((s) => ({ ...s, status: "done" as const }))) as AgentStepStatus[]
            );
          })
          .catch((e) => setError(String(e.message || e)))
          .finally(() => setIsRunning(false));
      }
    });

    return close;
  }, []);

  return (
    <AnalysisContext.Provider value={{ isRunning, agentTrace, report, error, runAnalysis, reset }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisContext(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysisContext must be used inside AnalysisProvider");
  return ctx;
}

export type { AgentName };
