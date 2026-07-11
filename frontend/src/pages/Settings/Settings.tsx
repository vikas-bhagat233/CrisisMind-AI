import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { checkHealth } from "../../services/api";

export default function Settings() {
  const [healthy, setHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    checkHealth().then(setHealthy);
  }, []);

  return (
    <DashboardLayout>
      <PageHeader eyebrow="Configuration" title="Settings" />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <p className="eyebrow mb-3">Backend connection</p>
          <div className="flex items-center gap-2">
            <Badge tone={healthy ? "LOW" : healthy === false ? "CRITICAL" : "neutral"}>
              {healthy === null ? "Checking…" : healthy ? "Connected" : "Unreachable"}
            </Badge>
            <span className="text-xs text-ink-muted font-mono">/api/health</span>
          </div>
        </Card>
        <Card>
          <p className="eyebrow mb-3">Integrations</p>
          <ul className="text-sm text-ink-muted space-y-2">
            <li>Fireworks AI — reasoning model for every agent</li>
            <li>Tavily — live search for the Research agent</li>
            <li>Supabase — persists reports for History and Dashboard</li>
          </ul>
          <p className="text-xs text-ink-faint mt-3">
            Configured via environment variables on the backend (.env). See README.md.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
