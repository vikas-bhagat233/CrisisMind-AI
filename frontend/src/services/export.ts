import type { CrisisReport } from "../types";

export function copyReportAsText(report: CrisisReport): string {
  return [
    `CrisisMind AI Report - ${report.crisis_type.toUpperCase()} in ${report.location}`,
    `Risk: ${report.risk.level} (${report.risk.score}/100)`,
    "",
    report.situation_summary,
    "",
    "Action plan:",
    ...report.action_plan.map((a) => `- ${a}`),
  ].join("\n");
}
