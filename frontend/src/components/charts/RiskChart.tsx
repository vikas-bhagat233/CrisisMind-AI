import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import type { RiskLevel } from "../../types";

const COLOR: Record<RiskLevel, string> = {
  LOW: "#27AE60",
  MODERATE: "#F2C94C",
  HIGH: "#F2994A",
  CRITICAL: "#E5484D",
};

export default function RiskChart({ level, score }: { level: RiskLevel; score: number }) {
  const data = [{ name: "risk", value: score, fill: COLOR[level] }];
  return (
    <div className="relative h-40 w-40 mx-auto">
      <ResponsiveContainer>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: "#1B2130" }} dataKey="value" cornerRadius={8} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-semibold text-ink">{score}</span>
        <span className="text-[10px] font-mono uppercase text-ink-muted">{level}</span>
      </div>
    </div>
  );
}
