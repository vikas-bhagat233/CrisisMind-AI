import React from "react";
import type { CrisisReport } from "../../types";
import ReportCard from "../reports/ReportCard";
import EmptyState from "../ui/EmptyState";

export default function RecentReports({ reports }: { reports: CrisisReport[] }) {
  if (reports.length === 0) {
    return (
      <EmptyState
        title="No reports yet"
        description="Run your first crisis analysis to see it appear here."
      />
    );
  }
  return (
    <div className="grid gap-3">
      {reports.slice(0, 6).map((r) => (
        <ReportCard key={r.id} report={r} />
      ))}
    </div>
  );
}
