import React from "react";
import type { CrisisReport } from "../../types";
import SeverityChart from "../charts/SeverityChart";

export default function DashboardCharts({ reports }: { reports: CrisisReport[] }) {
  const data = reports
    .slice(0, 8)
    .reverse()
    .map((r) => ({ label: r.location.slice(0, 10), score: r.risk.score }));

  return <SeverityChart data={data} />;
}
