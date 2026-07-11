import React from "react";
import type { CrisisReport } from "../../types";

export default function ActivityCard({ report }: { report: CrisisReport }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-base-700/60 last:border-0">
      <div>
        <p className="text-sm text-ink capitalize">{report.crisis_type} · {report.location}</p>
        <p className="text-xs text-ink-faint font-mono">
          {report.created_at ? new Date(report.created_at).toLocaleString() : ""}
        </p>
      </div>
      <span className="text-xs font-mono uppercase text-ink-muted">{report.risk.level}</span>
    </div>
  );
}
