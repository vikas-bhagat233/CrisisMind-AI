import React from "react";

export default function StatsCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="panel p-5">
      <p className="eyebrow mb-2">{label}</p>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
      {hint && <p className="text-xs text-ink-muted mt-1">{hint}</p>}
    </div>
  );
}
