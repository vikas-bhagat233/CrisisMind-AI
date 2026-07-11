import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-base-700/60 bg-base-950/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal animate-pulseDot" />
          <span className="font-display font-semibold tracking-tight text-ink">
            CrisisMind <span className="text-signal">AI</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "text-ink bg-base-700"
                  : "text-ink-muted hover:text-ink hover:bg-base-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/analyze"
          className="text-sm font-medium bg-signal text-white rounded-lg px-3.5 py-2 hover:bg-signal/90 transition-colors"
        >
          New analysis
        </Link>
      </div>
    </header>
  );
}
