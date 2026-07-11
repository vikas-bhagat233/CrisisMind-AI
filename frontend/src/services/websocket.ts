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
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const socket = new WebSocket(`${protocol}://${window.location.host}/api/ws/analyze`);

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
