import React from "react";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-base-600 rounded-xl">
      <p className="font-display text-lg text-ink mb-1">{title}</p>
      <p className="text-sm text-ink-muted max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}
