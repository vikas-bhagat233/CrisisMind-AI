import React from "react";

export default function MarkerPopup({ title, note }: { title: string; note?: string }) {
  return (
    <div className="text-xs">
      <p className="font-semibold">{title}</p>
      {note && <p className="text-ink-muted mt-1">{note}</p>}
    </div>
  );
}
