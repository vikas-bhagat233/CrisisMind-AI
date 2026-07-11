import React from "react";
import { Link } from "react-router-dom";
import type { CrisisReport } from "../../types";
import RiskBadge from "./RiskBadge";

export default function ReportCard({ report }: { report: CrisisReport }) {
  return (
    <Link
      to={`/report/${report.id}`}
      className="panel p-4 flex items-center justify-between hover:border-signal/50 transition-colors"
    >
      <div>
        <p className="font-display font-semibold text-ink">
          {report.crisis_type} · {report.location}
        </p>
        <p className="text-xs text-ink-muted mt-1 font-mono">
          {report.created_at ? new Date(report.created_at).toLocaleString() : ""}
        </p>
      </div>
      <RiskBadge level={report.risk.level} score={report.risk.score} />
    </Link>
  );
}
