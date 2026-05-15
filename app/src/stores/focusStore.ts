import { create } from "zustand";

type TimerState = "idle" | "running" | "paused" | "completed";

interface FocusStore {
  timerState: TimerState;
  timeRemaining: number;
  currentSession: number;
  isFocusMode: boolean;
  ambientSound: string | null;
  setTimerState: (state: TimerState) => void;
  setTimeRemaining: (time: number) => void;
  setCurrentSession: (session: number) => void;
  setIsFocusMode: (mode: boolean) => void;
  setAmbientSound: (sound: string | null) => void;
  reset: () => void;
}

export const useFocusStore = create<FocusStore>((set) => ({
  timerState: "idle",
  timeRemaining: 25 * 60,
  currentSession: 1,
  isFocusMode: false,
  ambientSound: null,
  setTimerState: (state) => set({ timerState: state }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setCurrentSession: (session) => set({ currentSession: session }),
  setIsFocusMode: (mode) => set({ isFocusMode: mode }),
  setAmbientSound: (sound) => set({ ambientSound: sound }),
  reset: () =>
    set({
      timerState: "idle",
      timeRemaining: 25 * 60,
      currentSession: 1,
      isFocusMode: false,
      ambientSound: null,
    }),
}));
