export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  reasons: string[];
}

export interface CommunicationDraft {
  sms: string;
  email_subject: string;
  email_body: string;
}

export interface AgentStepStatus {
  agent: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
}

export interface CrisisReport {
  id?: string;
  created_at?: string;
  query: string;
  crisis_type: string;
  location: string;
  situation_summary: string;
  research_findings: string[];
  risk: RiskAssessment;
  action_plan: string[];
  emergency_checklist: string[];
  communication: CommunicationDraft;
  timeline: string[];
  sources: string[];
  agent_trace: AgentStepStatus[];
  geo?: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  weather?: {
    temperature_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    weather_code: number;
    time?: string;
  };
  shelters?: {
    name: string;
    lat: number;
    lng: number;
  }[];
}

export const AGENT_PIPELINE = [
  "planner",
  "research",
  "risk",
  "response",
  "communication",
  "summary",
  "validator",
] as const;

export type AgentName = (typeof AGENT_PIPELINE)[number];

export interface EmergencyFeedItem {
  id: string;
  title: string;
  location: string;
  source: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  timestamp: number;
  link: string;
  query: string;
}

