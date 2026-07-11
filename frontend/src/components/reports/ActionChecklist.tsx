import React, { useState } from "react";

export default function ActionChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx}>
          <label className="flex items-start gap-3 text-sm cursor-pointer group">
            <input
              type="checkbox"
              checked={!!checked[idx]}
              onChange={() => setChecked((c) => ({ ...c, [idx]: !c[idx] }))}
              className="mt-0.5 h-4 w-4 rounded border-base-600 bg-base-900 accent-signal"
            />
            <span
              className={`transition-colors ${
                checked[idx] ? "text-ink-faint line-through" : "text-ink group-hover:text-ink"
              }`}
            >
              {item}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
