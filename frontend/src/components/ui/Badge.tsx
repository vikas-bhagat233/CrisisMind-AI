import React from "react";

const styles: Record<string, string> = {
  LOW: "bg-risk-low/15 text-risk-low border-risk-low/40",
  MODERATE: "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/40",
  HIGH: "bg-risk-high/15 text-risk-high border-risk-high/40",
  CRITICAL: "bg-risk-critical/15 text-risk-critical border-risk-critical/40",
  neutral: "bg-base-700 text-ink-muted border-base-600",
};

export default function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof styles;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
