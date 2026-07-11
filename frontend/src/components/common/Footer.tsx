import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-base-700/60 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint">
        <span>CrisisMind AI - AI-powered Crisis Intelligence & Decision Support Platform.</span>
        <span className="font-mono">Not a substitute for official emergency services.</span>
      </div>
    </footer>
  );
}
