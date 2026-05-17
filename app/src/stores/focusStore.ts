import { create } from "zustand";
import type { Session } from "@/types";
import { generateId } from "@/lib/utils";

type TimerState = "idle" | "running" | "paused" | "completed";

interface FocusStore {
  timerState: TimerState;
  timeRemaining: number;
  currentSession: number;
  isFocusMode: boolean;
  ambientSound: string | null;
  totalToday: number;
  sessions: Session[];
  setTimerState: (state: TimerState) => void;
  setTimeRemaining: (time: number) => void;
  setCurrentSession: (session: number) => void;
  setIsFocusMode: (mode: boolean) => void;
  setAmbientSound: (sound: string | null) => void;
  completeSession: () => Promise<void>;
  loadSessions: () => Promise<void>;
  reset: () => void;
}

async function saveSessionToDb(session: Session) {
  try {
    const Database = (await import("@tauri-apps/plugin-sql")).default;
    const db = await Database.load("sqlite:cogniflow.db");
    await db.execute(
      `INSERT INTO sessions (id, type, duration, completed, started_at, ended_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [session.id, session.type, session.duration, session.completed ? 1 : 0, session.started_at, session.ended_at]
    );
  } catch (e) {
    console.error("Failed to save session:", e);
  }
}

export const useFocusStore = create<FocusStore>((set, get) => ({
  timerState: "idle",
  timeRemaining: 25 * 60,
  currentSession: 1,
  isFocusMode: false,
  ambientSound: null,
  totalToday: 0,
  sessions: [],

  setTimerState: (state) => set({ timerState: state }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setCurrentSession: (session) => set({ currentSession: session }),
  setIsFocusMode: (mode) => set({ isFocusMode: mode }),
  setAmbientSound: (sound) => set({ ambientSound: sound }),

  loadSessions: async () => {
    try {
      const Database = (await import("@tauri-apps/plugin-sql")).default;
      const db = await Database.load("sqlite:cogniflow.db");
      const rows: any[] = await db.select("SELECT * FROM sessions WHERE completed = 1 ORDER BY started_at DESC");
      const today = new Date().toDateString();
      const todayCount = rows.filter((r) => new Date(r.started_at).toDateString() === today).length;
      set({
        sessions: rows,
        totalToday: todayCount,
        currentSession: rows.length + 1,
      });
    } catch (e) {
      console.error("Failed to load sessions:", e);
    }
  },

  completeSession: async () => {
    const session: Session = {
      id: generateId(),
      type: "pomodoro",
      duration: 25 * 60,
      completed: true,
      started_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      ended_at: new Date().toISOString(),
    };
    await saveSessionToDb(session);
    set((state) => ({
      currentSession: state.currentSession + 1,
      totalToday: state.totalToday + 1,
      sessions: [session, ...state.sessions],
    }));
  },

  reset: () =>
    set({
      timerState: "idle",
      timeRemaining: 25 * 60,
      currentSession: 1,
      isFocusMode: false,
      ambientSound: null,
    }),
}));
