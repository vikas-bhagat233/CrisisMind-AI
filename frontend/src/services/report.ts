import { reportPdfUrl } from "./api";

export function downloadReportPdf(reportId: string) {
  const url = reportPdfUrl(reportId);
  const link = document.createElement("a");
  link.href = url;
  link.download = `crisismind-${reportId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
