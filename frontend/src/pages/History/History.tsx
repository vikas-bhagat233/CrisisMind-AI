import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import ReportCard from "../../components/reports/ReportCard";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/common/Loader";
import Button from "../../components/ui/Button";
import { listReports } from "../../services/api";
import type { CrisisReport } from "../../types";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [reports, setReports] = useState<CrisisReport[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    listReports().then((r) => {
      setReports(r);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Past analyses"
        title="History"
        description="Every crisis analysis you've run, most recent first."
      />
      {loading ? (
        <Loader label="Loading history" />
      ) : reports.length === 0 ? (
        <EmptyState
          title="No history yet"
          description="Reports you generate will be saved here automatically."
          action={<Button onClick={() => navigate("/analyze")}>Run an analysis</Button>}
        />
      ) : (
        <div className="grid gap-3">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
