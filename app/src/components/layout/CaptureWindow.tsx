import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { generateId } from "@/lib/utils";
import { X, Mic, Camera, Sparkles, Send, Type, Image } from "lucide-react";

interface CaptureWindowProps {
  onSave?: (content: string) => void;
}

export function CaptureWindow({ onSave }: CaptureWindowProps) {
  const { captureOpen, setCaptureOpen } = useAppStore();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState<"text" | "voice" | "screenshot">("text");

  const handleSave = () => {
    if (!content.trim()) return;
    onSave?.(content);
    setContent("");
    setTitle("");
    setTags([]);
    setCaptureOpen(false);
  };

  const handleAiProcess = async () => {
    setProcessing(true);
    // Simulate AI processing - in production calls Rust command
    setTimeout(() => {
      const extracted = ["ai", "thought", "idea"];
      setTags(extracted);
      setProcessing(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {captureOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setCaptureOpen(false)}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="glass-strong rounded-2xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Quick Capture</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCaptureOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="px-4 pt-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-3"
              />

              <div className="flex gap-2 mb-3">
                <Button
                  variant={mode === "text" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setMode("text")}
                >
                  <Type className="w-4 h-4 mr-1" /> Text
                </Button>
                <Button
                  variant={mode === "voice" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setMode("voice")}
                >
                  <Mic className="w-4 h-4 mr-1" /> Voice
                </Button>
                <Button
                  variant={mode === "screenshot" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setMode("screenshot")}
                >
                  <Camera className="w-4 h-4 mr-1" /> Screenshot
                </Button>
              </div>

              {mode === "text" && (
                <textarea
                  className="w-full h-32 glass-input rounded-lg p-3 text-sm resize-none focus:outline-none"
                  placeholder="What's on your mind? Press Ctrl+Shift+C anytime to capture..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  autoFocus
                />
              )}

              {mode === "voice" && (
                <div className="h-32 glass-input rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Mic className="w-8 h-8 text-primary mx-auto mb-2 animate-pulse" />
                    <p className="text-sm text-muted-foreground">Recording... (click to stop)</p>
                  </div>
                </div>
              )}

              {mode === "screenshot" && (
                <div className="h-32 glass-input rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Screenshot capture ready</p>
                  </div>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="px-4 pt-3 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="accent">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between p-4 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAiProcess}
                disabled={processing || !content.trim()}
              >
                <Sparkles className={`w-4 h-4 mr-1 ${processing ? "animate-spin" : ""}`} />
                {processing ? "Processing..." : "AI Analyze"}
              </Button>

              <Button
                variant="gradient"
                size="sm"
                onClick={handleSave}
                disabled={!content.trim()}
              >
                <Send className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
