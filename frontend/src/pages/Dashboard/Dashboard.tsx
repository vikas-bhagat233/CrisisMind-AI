import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import StatsCard from "../../components/dashboard/StatsCard";
import RecentReports from "../../components/dashboard/RecentReports";
import RiskSummary from "../../components/dashboard/RiskSummary";
import DashboardCharts from "../../components/dashboard/DashboardCharts";
import Loader from "../../components/common/Loader";
import { listReports, listFeeds } from "../../services/api";
import type { CrisisReport, EmergencyFeedItem } from "../../types";

export default function Dashboard() {
  const [reports, setReports] = useState<CrisisReport[]>([]);
  const [feeds, setFeeds] = useState<EmergencyFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([listReports(), listFeeds()]).then(([r, f]) => {
      setReports(r);
      setFeeds(f);
      setLoading(false);
    });
  }, []);

  const highOrCritical = reports.filter((r) => r.risk.level === "HIGH" || r.risk.level === "CRITICAL").length;
  const avgScore = reports.length
    ? Math.round(reports.reduce((sum, r) => sum + r.risk.score, 0) / reports.length)
    : 0;

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Operations overview"
        title="Dashboard"
        description="Recent incidents, risk trends, and activity across every analysis you've run."
      />

      {loading ? (
        <Loader label="Loading dashboard" />
      ) : (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <StatsCard label="Total reports" value={reports.length} />
            <StatsCard label="High / critical risk" value={highOrCritical} />
            <StatsCard label="Average risk score" value={avgScore} hint="out of 100" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 panel p-5">
              <p className="eyebrow mb-4">Risk score by recent incident</p>
              <DashboardCharts reports={reports} />
            </div>
            <div className="panel p-5">
              <p className="eyebrow mb-4">Risk distribution</p>
              <RiskSummary reports={reports} />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <p className="eyebrow mb-4">Recent reports</p>
              <RecentReports reports={reports} />
            </div>
            <div className="panel p-5 h-fit">
              <div className="flex items-center justify-between mb-4">
                <p className="eyebrow">Live Emergency Feed</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-ink-muted">Live</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {feeds.length === 0 ? (
                  <p className="text-xs text-ink-faint">No active emergency alerts.</p>
                ) : (
                  feeds.map((feed) => (
                    <div key={feed.id} className="border-b border-base-600/40 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono bg-base-900 border border-base-600 px-1.5 py-0.5 rounded text-ink-muted">
                          {feed.source}
                        </span>
                        <span className={`text-[10px] font-bold ${
                          feed.severity === "CRITICAL" ? "text-risk-critical" :
                          feed.severity === "HIGH" ? "text-risk-high" : "text-risk-moderate"
                        }`}>
                          {feed.severity}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-ink leading-tight hover:text-signal transition-colors">
                        <a href={feed.link} target="_blank" rel="noopener noreferrer">{feed.title}</a>
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-ink-faint">
                          {new Date(feed.timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <button
                          onClick={() => navigate("/analyze", { state: { query: feed.query } })}
                          className="text-[10px] text-signal font-semibold hover:underline"
                        >
                          Analyze →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

