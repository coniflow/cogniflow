import { create } from "zustand";
import type { Note } from "@/types";

interface NoteStore {
  notes: Note[];
  selectedNote: Note | null;
  loading: boolean;
  searchQuery: string;
  searchResults: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  removeNote: (id: string) => void;
  selectNote: (note: Note | null) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Note[]) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  selectedNote: null,
  loading: false,
  searchQuery: "",
  searchResults: [],
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, data) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...data, updated_at: new Date().toISOString() } : n
      ),
    })),
  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),
  selectNote: (note) => set({ selectedNote: note }),
  setLoading: (loading) => set({ loading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
}));
