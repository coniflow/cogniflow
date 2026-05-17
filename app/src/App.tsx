import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { CaptureWindow } from "@/components/layout/CaptureWindow";
import { SettingsPanel } from "@/components/layout/SettingsPanel";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { NotesList } from "@/components/notes/NotesList";
import { KnowledgeGraph } from "@/components/graph/KnowledgeGraph";
import { FocusMode } from "@/components/focus/FocusMode";
import { SearchBar } from "@/components/search/SearchBar";
import { useNoteStore } from "@/stores/noteStore";
import { useAppStore } from "@/stores/appStore";
import { useFocusStore } from "@/stores/focusStore";
import type { Note } from "@/types";
import { generateId } from "@/lib/utils";
import { invoke } from "@tauri-apps/api/core";
import { Brain } from "lucide-react";

type ViewType = "dashboard" | "notes" | "search" | "focus" | "graph";

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { setCaptureOpen } = useAppStore();
  const { addNote, loadNotes, loaded } = useNoteStore();
  const { setTimeRemaining, setTimerState } = useFocusStore();

  useEffect(() => {
    loadNotes();
    loadSettings();
  }, []);

  useEffect(() => {
    if (loaded && useNoteStore.getState().notes.length === 0) {
      seedWelcomeNote();
    }
  }, [loaded]);

  const loadSettings = async () => {
    try {
      const { load } = await import("@tauri-apps/plugin-store");
      const store = await load("settings.json");
      const saved = await store.get<any>("settings");
      if (saved) {
        useAppStore.getState().updateSettings(saved);
        if (saved.focusDuration) {
          setTimeRemaining(saved.focusDuration * 60);
        }
      }
    } catch (e) {
      console.log("Settings not found, using defaults");
    }
  };

  const seedWelcomeNote = async () => {
    const note: Note = {
      id: generateId(),
      title: "Welcome to CogniFlow!",
      content:
        "This is your first note. CogniFlow is your private AI second brain.\n\nTry these features:\n- Capture thoughts with Ctrl+Shift+C\n- Connect ideas in the Knowledge Graph\n- Focus with the Pomodoro timer\n- Search across all your notes\n\nYour data stays on your machine - private by default.",
      tags: ["welcome", "getting-started"],
      entities: ["CogniFlow"],
      connections: ["Productivity", "Knowledge Management"],
      summary: "Welcome note with feature overview",
      source: "text",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await addNote(note);
  };

  const handleCaptureSave = async (content: string, aiProcessed?: { summary: string; tags: string[]; entities: string[]; connections: string[] }) => {
    const now = new Date().toISOString();
    const note: Note = {
      id: generateId(),
      title: content.slice(0, 60) + (content.length > 60 ? "..." : ""),
      content,
      tags: aiProcessed?.tags || [],
      entities: aiProcessed?.entities || [],
      connections: aiProcessed?.connections || [],
      summary: aiProcessed?.summary || "",
      source: "text",
      created_at: now,
      updated_at: now,
    };
    await addNote(note);
  };

  const handleNoteClick = (note: Note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setEditorOpen(true);
  };

  const handleSaveNote = async (note: Note) => {
    if (editingNote) {
      await useNoteStore.getState().updateNote(note.id, note);
    } else {
      await addNote(note);
    }
    setEditorOpen(false);
    setEditingNote(null);
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onNewNote={handleCreateNote} />;
      case "notes":
        return <NotesList onSelectNote={handleNoteClick} onCreateNote={handleCreateNote} />;
      case "search":
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-1">
              <Brain className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Search</h1>
            </div>
            <p className="text-muted-foreground mb-4">Semantic search across your second brain.</p>
            <SearchBar />
            <div className="mt-6">
              <NotesList onSelectNote={handleNoteClick} onCreateNote={handleCreateNote} />
            </div>
          </div>
        );
      case "focus":
        return <FocusMode />;
      case "graph":
        return <KnowledgeGraph />;
      default:
        return <Dashboard onNewNote={handleCreateNote} />;
    }
  };

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={(v) => setActiveView(v as ViewType)} />

      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <CaptureWindow onSave={handleCaptureSave} />
      <SettingsPanel />
      <NoteEditor
        note={editingNote}
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setEditingNote(null); }}
        onSave={handleSaveNote}
      />
    </div>
  );
}
