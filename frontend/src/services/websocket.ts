import type { AgentName, CrisisReport } from "../types";

export type LiveAnalysisEvent =
  | { type: "agent_status"; agent: AgentName; status: "running" | "done" }
  | { type: "complete"; report: CrisisReport }
  | { type: "error"; detail: string };

/**
 * Opens a WebSocket to /api/ws/analyze and streams per-agent progress events.
 * Falls back gracefully - callers should also be able to use the plain
 * REST `analyze()` call if sockets are unavailable (e.g. some proxies).
 */
export function runLiveAnalysis(
  query: string,
  locationHint: string | undefined,
  onEvent: (event: LiveAnalysisEvent) => void
): () => void {
  const apiBase = (import.meta as any).env?.VITE_API_BASE;
  let socketUrl = "";
  if (apiBase) {
    // Strip "/api" suffix if present
    const cleanBase = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase;
    const wsProtocol = cleanBase.startsWith("https:") ? "wss" : "ws";
    // Strip http:// or https:// to get host
    const host = cleanBase.replace(/^https?:\/\//, "");
    socketUrl = `${wsProtocol}://${host}/api/ws/analyze`;
  } else {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    socketUrl = `${protocol}://${window.location.host}/api/ws/analyze`;
  }

  const socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    socket.send(JSON.stringify({ query, location_hint: locationHint }));
  };
  socket.onmessage = (evt) => {
    try {
      const parsed = JSON.parse(evt.data) as LiveAnalysisEvent;
      onEvent(parsed);
    } catch {
      // ignore malformed frames
    }
  };
  socket.onerror = () => {
    onEvent({ type: "error", detail: "WebSocket connection error" });
  };

  return () => socket.close();
}
