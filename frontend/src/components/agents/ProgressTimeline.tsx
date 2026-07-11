import React from "react";

export default function ProgressTimeline({ items }: { items: string[] }) {
  return (
    <ol className="relative border-l border-base-600 pl-5 space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="relative">
          <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-signal" />
          <p className="text-sm text-ink">{item}</p>
        </li>
      ))}
    </ol>
  );
}
