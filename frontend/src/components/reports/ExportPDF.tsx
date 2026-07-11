import React from "react";
import Button from "../ui/Button";
import { downloadReportPdf } from "../../services/report";

export default function ExportPDF({ reportId }: { reportId: string }) {
  return (
    <Button variant="ghost" onClick={() => downloadReportPdf(reportId)}>
      Export PDF
    </Button>
  );
}
