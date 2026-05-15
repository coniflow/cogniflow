export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  entities: string[];
  connections: string[];
  summary: string;
  source: "text" | "voice" | "screenshot";
  created_at: string;
  updated_at: string;
}

export interface AiResponse {
  summary: string;
  tags: string[];
  entities: string[];
  connections: string[];
}

export interface Session {
  id: string;
  type: "pomodoro" | "focus";
  duration: number;
  completed: boolean;
  started_at: string;
  ended_at: string | null;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "note" | "tag" | "entity";
  val: number;
  color?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
  weight?: number;
}

export interface DashboardInsight {
  id: string;
  type: "trend" | "connection" | "suggestion" | "stats";
  title: string;
  description: string;
  icon?: string;
}

export interface AppSettings {
  hotkey: string;
  ollamaEndpoint: string;
  ollamaModel: string;
  theme: "dark" | "system";
  autoTag: boolean;
  autoSummarize: boolean;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  language: string;
}
