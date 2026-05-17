import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNoteStore } from "@/stores/noteStore";
import { useAppStore } from "@/stores/appStore";
import { formatDate } from "@/lib/utils";
import { X, Save, Trash2, Sparkles, Tag, Brain } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import type { Note } from "@/types";
import { generateId } from "@/lib/utils";

interface NoteEditorProps {
  note: Note | null;
  open: boolean;
  onClose: () => void;
  onSave: (note: Note) => Promise<void>;
}

export function NoteEditor({ note, open, onClose, onSave }: NoteEditorProps) {
  const isNew = !note;
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [summary, setSummary] = useState(note?.summary || "");
  const [saving, setSaving] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setSummary(note.summary);
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setSummary("");
    }
    setTagInput("");
  }, [note, open]);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    const now = new Date().toISOString();
    const noteData: Note = {
      id: note?.id || generateId(),
      title: title || content.slice(0, 60) + (content.length > 60 ? "..." : ""),
      content,
      tags,
      entities: note?.entities || [],
      connections: note?.connections || [],
      summary,
      source: note?.source || "text",
      created_at: note?.created_at || now,
      updated_at: now,
    };
    await onSave(noteData);
    setSaving(false);
  };

  const handleAiProcess = async () => {
    if (!content.trim()) return;
    setAiProcessing(true);
    const { settings } = useAppStore.getState();
    const endpoint = settings.ollamaEndpoint || "http://localhost:11434";
    const model = settings.ollamaModel || "llama3.2";
    try {
      const result = await invoke<{
        summary: string;
        tags: string[];
        entities: string[];
        connections: string[];
      }>("process_with_ai", { text: content, endpoint, model });
      if (result.summary) setSummary(result.summary);
      if (result.tags.length > 0) {
        const merged = [...new Set([...tags, ...result.tags])];
        setTags(merged);
      }
      if (result.entities.length > 0) {
        useNoteStore.getState().updateNote(note?.id || "", { entities: result.entities });
      }
    } catch (e) {
      console.error("AI processing failed:", e);
    }
    setAiProcessing(false);
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="glass-strong rounded-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">{isNew ? "New Note" : "Edit Note"}</h2>
              </div>
              <div className="flex items-center gap-2">
                {!isNew && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={async () => {
                      await useNoteStore.getState().removeNote(note!.id);
                      onClose();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <Input
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold h-auto py-2"
              />

              <textarea
                className="w-full min-h-[200px] glass-input rounded-lg p-3 text-sm resize-none focus:outline-none"
                placeholder="Start writing your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {summary && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-primary font-medium mb-1">AI Summary</p>
                  <p className="text-sm text-muted-foreground">{summary}</p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    className="h-8 text-xs flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={addTag}>Add</Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAiProcess}
                disabled={aiProcessing || !content.trim()}
              >
                <Sparkles className={`w-4 h-4 mr-1 ${aiProcessing ? "animate-spin" : ""}`} />
                {aiProcessing ? "Analyzing..." : "AI Analyze"}
              </Button>

              <div className="flex items-center gap-2">
                {note && (
                  <span className="text-[10px] text-muted-foreground">
                    Updated {formatDate(note.updated_at)}
                  </span>
                )}
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving || !content.trim()}
                >
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
