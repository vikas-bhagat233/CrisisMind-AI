import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AgentWorkflow from "../../components/agents/AgentWorkflow";
import RiskBadge from "../../components/reports/RiskBadge";
import { useAnalysis } from "../../hooks/useAnalysis";
import { CRISIS_EXAMPLES } from "../../utils/constants";

export default function Analyze() {
  const location = useLocation() as { state?: { query?: string } };
  const navigate = useNavigate();
  const { isRunning, agentTrace, report, error, runAnalysis } = useAnalysis();
  const [query, setQuery] = useState(location.state?.query ?? "");
  const hasAutoRun = useRef(false);

  useEffect(() => {
    if (location.state?.query && !hasAutoRun.current) {
      hasAutoRun.current = true;
      runAnalysis(location.state.query);
    }
  }, [location.state, runAnalysis]);

  const start = () => {
    if (!query.trim()) return;
    runAnalysis(query.trim());
  };

  return (
    <MainLayout>
      <div className="max-w-3xl">
        <p className="eyebrow mb-2">New analysis</p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-6">
          Describe the situation
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && start()}
            placeholder="e.g. Cyclone warning issued for coastal Odisha"
            disabled={isRunning}
          />
          <Button onClick={start} disabled={isRunning} className="sm:w-40">
            {isRunning ? "Running…" : "Run analysis"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {CRISIS_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setQuery(ex)}
              className="text-xs text-ink-muted border border-base-600 rounded-full px-3 py-1.5 hover:text-ink hover:border-signal/60 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {(isRunning || report || error) && (
        <div className="mt-10 space-y-6">
          <AgentWorkflow trace={agentTrace} />

          {error && (
            <div className="panel p-4 border-risk-critical/40 text-risk-critical text-sm">
              {error}
            </div>
          )}

          {report && (
            <div className="panel p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="eyebrow mb-1">Result</p>
                  <p className="font-display text-xl font-semibold text-ink capitalize">
                    {report.crisis_type} · {report.location}
                  </p>
                </div>
                <RiskBadge level={report.risk.level} score={report.risk.score} />
              </div>
              <p className="text-sm text-ink-muted mb-4">{report.situation_summary}</p>
              <Button onClick={() => navigate(`/report/${report.id}`)}>
                View full report →
              </Button>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
}
