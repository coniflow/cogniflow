import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { CaptureWindow } from "@/components/layout/CaptureWindow";
import { SettingsPanel } from "@/components/layout/SettingsPanel";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { NotesList } from "@/components/notes/NotesList";
import { KnowledgeGraph } from "@/components/graph/KnowledgeGraph";
import { FocusMode } from "@/components/focus/FocusMode";
import { SearchBar } from "@/components/search/SearchBar";
import { useNoteStore } from "@/stores/noteStore";
import { useAppStore } from "@/stores/appStore";
import type { Note } from "@/types";
import { generateId } from "@/lib/utils";
import { Brain } from "lucide-react";

type ViewType = "dashboard" | "notes" | "search" | "focus" | "graph";

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { setCaptureOpen } = useAppStore();
  const { addNote } = useNoteStore();

  useEffect(() => {
    const seedDemoNotes = () => {
      const demo: Note[] = [
        {
          id: generateId(),
          title: "Project Alpha - Architecture Ideas",
          content: "Thinking about using a microservices architecture with event sourcing for Project Alpha. The main challenge will be handling eventual consistency across services. Need to research more about Saga patterns and how they handle rollbacks.",
          tags: ["work", "architecture", "microservices"],
          entities: ["Project Alpha", "Saga Pattern"],
          connections: ["System Design", "Distributed Systems"],
          summary: "Exploring microservices architecture for Project Alpha",
          source: "text",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          updated_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: generateId(),
          title: "Book Notes: Thinking in Systems",
          content: "Key insight: Systems thinking is about understanding the interconnections rather than linear cause-effect. Leverage points are places to intervene in a system. The most effective leverage points are often the least obvious.",
          tags: ["reading", "systems", "learning"],
          entities: ["Donella Meadows", "Systems Thinking"],
          connections: ["Product Strategy", "Machine Learning"],
          summary: "Notes on systems thinking and leverage points",
          source: "text",
          created_at: new Date(Date.now() - 18000000).toISOString(),
          updated_at: new Date(Date.now() - 18000000).toISOString(),
        },
        {
          id: generateId(),
          title: "Meeting Notes - Product Review",
          content: "Quarterly product review discussed: User engagement up 15%, but retention dipped in the onboarding flow. Action items: Revamp onboarding wizard, add progress indicators, and implement early user feedback loop.",
          tags: ["work", "meeting", "product"],
          entities: ["Product Review"],
          connections: ["User Experience", "Product Strategy"],
          summary: "Q3 product review meeting notes",
          source: "text",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      demo.forEach((note) => addNote(note));
    };

    if (useNoteStore.getState().notes.length === 0) {
      seedDemoNotes();
    }
  }, [addNote]);

  const handleCaptureSave = (content: string) => {
    const note: Note = {
      id: generateId(),
      title: content.slice(0, 60) + (content.length > 60 ? "..." : ""),
      content,
      tags: [],
      entities: [],
      connections: [],
      summary: "",
      source: "text",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addNote(note);
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "notes":
        return <NotesList onSelectNote={setSelectedNote} />;
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
              <NotesList onSelectNote={setSelectedNote} />
            </div>
          </div>
        );
      case "focus":
        return <FocusMode />;
      case "graph":
        return <KnowledgeGraph />;
      default:
        return <Dashboard />;
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
    </div>
  );
}
