import React from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink">{title}</h1>
        {description && <p className="text-ink-muted mt-2 max-w-2xl">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
