import { create } from "zustand";
import Database from "@tauri-apps/plugin-sql";
import type { Note } from "@/types";

let db: Database | null = null;
let initPromise: Promise<Database> | null = null;

async function getDb(): Promise<Database> {
  if (db) return db;
  if (!initPromise) {
    initPromise = Database.load("sqlite:cogniflow.db");
  }
  db = await initPromise;
  return db;
}

function rowToNote(row: any): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    tags: JSON.parse(row.tags || "[]"),
    entities: JSON.parse(row.entities || "[]"),
    connections: JSON.parse(row.connections || "[]"),
    summary: row.summary || "",
    source: row.source || "text",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

interface NoteStore {
  notes: Note[];
  loading: boolean;
  loaded: boolean;
  selectedNote: Note | null;
  searchQuery: string;
  searchResults: Note[];
  loadNotes: () => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  selectNote: (note: Note | null) => void;
  setSearchQuery: (query: string) => void;
  totalNotes: () => number;
  weeklyNotes: () => number;
  totalConnections: () => number;
  recentNotes: (limit?: number) => Note[];
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  loading: false,
  loaded: false,
  selectedNote: null,
  searchQuery: "",
  searchResults: [],

  loadNotes: async () => {
    set({ loading: true });
    try {
      const database = await getDb();
      const rows: any[] = await database.select("SELECT * FROM notes ORDER BY created_at DESC");
      const notes = rows.map(rowToNote);
      set({ notes, loaded: true, loading: false });
    } catch (e) {
      console.error("Failed to load notes:", e);
      set({ loading: false });
    }
  },

  addNote: async (note) => {
    try {
      const database = await getDb();
      await database.execute(
        `INSERT INTO notes (id, title, content, tags, entities, connections, summary, source, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          note.id,
          note.title,
          note.content,
          JSON.stringify(note.tags),
          JSON.stringify(note.entities),
          JSON.stringify(note.connections),
          note.summary || "",
          note.source || "text",
          note.created_at,
          note.updated_at,
        ]
      );
      set((state) => ({ notes: [note, ...state.notes] }));
    } catch (e) {
      console.error("Failed to add note:", e);
    }
  },

  updateNote: async (id, data) => {
    try {
      const database = await getDb();
      const fields: string[] = [];
      const values: any[] = [];

      if (data.title !== undefined) { fields.push("title = $1"); values.push(data.title); }
      if (data.content !== undefined) { fields.push("content = $2"); values.push(data.content); }
      if (data.tags !== undefined) { fields.push("tags = $3"); values.push(JSON.stringify(data.tags)); }
      if (data.entities !== undefined) { fields.push("entities = $4"); values.push(JSON.stringify(data.entities)); }
      if (data.connections !== undefined) { fields.push("connections = $5"); values.push(JSON.stringify(data.connections)); }
      if (data.summary !== undefined) { fields.push("summary = $6"); values.push(data.summary); }
      if (data.source !== undefined) { fields.push("source = $7"); values.push(data.source); }
      fields.push("updated_at = $8");
      values.push(new Date().toISOString());
      values.push(id);

      await database.execute(
        `UPDATE notes SET ${fields.join(", ")} WHERE id = $${values.length}`,
        values
      );

      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === id ? { ...n, ...data, updated_at: new Date().toISOString() } : n
        ),
      }));
    } catch (e) {
      console.error("Failed to update note:", e);
    }
  },

  removeNote: async (id) => {
    try {
      const database = await getDb();
      await database.execute("DELETE FROM notes WHERE id = $1", [id]);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
      }));
    } catch (e) {
      console.error("Failed to remove note:", e);
    }
  },

  selectNote: (note) => set({ selectedNote: note }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  totalNotes: () => get().notes.length,

  weeklyNotes: () => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return get().notes.filter((n) => new Date(n.created_at).getTime() > weekAgo).length;
  },

  totalConnections: () => {
    return get().notes.reduce((sum, n) => sum + n.connections.length, 0);
  },

  recentNotes: (limit = 5) => {
    return get().notes.slice(0, limit);
  },
}));
