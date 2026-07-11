import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="text-center py-24">
        <p className="font-mono text-signal text-sm mb-3">404</p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-3">Page not found</h1>
        <p className="text-ink-muted mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="text-signal hover:underline text-sm">
          Back to home
        </Link>
      </div>
    </MainLayout>
  );
}
