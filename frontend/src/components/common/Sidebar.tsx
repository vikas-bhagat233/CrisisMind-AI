import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "Overview", icon: "◆" },
  { to: "/history", label: "History", icon: "▤" },
  { to: "/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-base-700/60 pr-4">
      <p className="eyebrow mb-3 px-2">Operations</p>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive ? "bg-base-700 text-ink" : "text-ink-muted hover:bg-base-800 hover:text-ink"
              }`
            }
          >
            <span className="text-signal">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
