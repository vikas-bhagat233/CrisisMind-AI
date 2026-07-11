import type { CrisisReport, EmergencyFeedItem } from "../types";

const BASE = "/api";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Request failed (${res.status}): ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function analyze(query: string, locationHint?: string): Promise<CrisisReport> {
  const res = await fetch(`${BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, location_hint: locationHint || undefined }),
  });
  const data = await json<{ report: CrisisReport }>(res);
  return data.report;
}

export async function listReports(limit = 50): Promise<CrisisReport[]> {
  const res = await fetch(`${BASE}/reports?limit=${limit}`);
  const data = await json<{ reports: CrisisReport[] }>(res);
  return data.reports;
}

export async function getReport(id: string): Promise<CrisisReport> {
  const res = await fetch(`${BASE}/reports/${id}`);
  const data = await json<{ report: CrisisReport }>(res);
  return data.report;
}

export function reportPdfUrl(id: string): string {
  return `${BASE}/reports/${id}/pdf`;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function translateReport(id: string, targetLanguage: string): Promise<CrisisReport> {
  const res = await fetch(`${BASE}/reports/${id}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target_language: targetLanguage }),
  });
  return json<CrisisReport>(res);
}

export async function listFeeds(): Promise<EmergencyFeedItem[]> {
  const res = await fetch(`${BASE}/feeds`);
  const data = await json<{ feeds: EmergencyFeedItem[] }>(res);
  return data.feeds;
}

