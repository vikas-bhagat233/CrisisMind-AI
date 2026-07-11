import React from "react";
import type { RiskLevel } from "../../types";
import Badge from "../ui/Badge";

export default function RiskBadge({ level, score }: { level: RiskLevel; score: number }) {
  return (
    <div className="flex items-center gap-2">
      <Badge tone={level}>{level}</Badge>
      <span className="font-mono text-xs text-ink-muted">{score}/100</span>
    </div>
  );
}
