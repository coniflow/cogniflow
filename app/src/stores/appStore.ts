import { create } from "zustand";
import type { AppSettings } from "@/types";

interface AppStore {
  sidebarOpen: boolean;
  captureOpen: boolean;
  settingsOpen: boolean;
  settings: AppSettings;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCaptureOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  updateSettings: (data: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  hotkey: "Ctrl+Shift+C",
  ollamaEndpoint: "http://localhost:11434",
  ollamaModel: "llama3.2",
  theme: "dark",
  autoTag: true,
  autoSummarize: true,
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  language: "en",
};

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

async function persistSettings(settings: AppSettings) {
  try {
    const { load } = await import("@tauri-apps/plugin-store");
    const store = await load("settings.json");
    await store.set("settings", settings);
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => store.save(), 500);
  } catch (e) {
    console.log("Settings persistence not available:", e);
  }
}

export const useAppStore = create<AppStore>((set, get) => ({
  sidebarOpen: true,
  captureOpen: false,
  settingsOpen: false,
  settings: defaultSettings,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCaptureOpen: (open) => set({ captureOpen: open }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  updateSettings: (data) => {
    const newSettings = { ...get().settings, ...data };
    set({ settings: newSettings });
    persistSettings(newSettings);
  },
}));
