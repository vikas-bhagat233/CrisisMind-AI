import React from "react";
import type { CrisisReport } from "../../types";

export default function RiskSummary({ reports }: { reports: CrisisReport[] }) {
  const counts = { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 } as Record<string, number>;
  reports.forEach((r) => (counts[r.risk.level] = (counts[r.risk.level] || 0) + 1));
  const total = reports.length || 1;

  return (
    <div className="space-y-3">
      {Object.entries(counts).map(([level, count]) => (
        <div key={level}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-mono uppercase text-ink-muted">{level}</span>
            <span className="text-ink-muted">{count}</span>
          </div>
          <div className="h-1.5 rounded-full bg-base-700 overflow-hidden">
            <div
              className="h-full bg-signal"
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
