import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { invoke } from "@tauri-apps/api/core";
import {
  X,
  Settings,
  Keyboard,
  Bot,
  Timer,
  Database,
  Shield,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  FileDown,
} from "lucide-react";

export function SettingsPanel() {
  const { settingsOpen, setSettingsOpen, settings, updateSettings } = useAppStore();
  const [ollamaStatus, setOllamaStatus] = useState<"unknown" | "connected" | "disconnected">("unknown");
  const [checkingOllama, setCheckingOllama] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<string>("");

  const checkOllama = async () => {
    setCheckingOllama(true);
    try {
      const ok = await invoke<boolean>("check_ollama", { endpoint: settings.ollamaEndpoint });
      setOllamaStatus(ok ? "connected" : "disconnected");
    } catch {
      setOllamaStatus("disconnected");
    }
    setCheckingOllama(false);
  };

  const handleExport = async (format: string) => {
    setExporting(true);
    setExportResult("");
    try {
      const { useNoteStore } = await import("@/stores/noteStore");
      const notes = useNoteStore.getState().notes;
      const result = await invoke<{ path: string; size: number }>("export_notes", { format, notesJson: JSON.stringify(notes) });
      const sizeKB = (result.size / 1024).toFixed(1);
      setExportResult(`Exported to ${result.path} (${sizeKB} KB)`);
    } catch (e) {
      setExportResult(`Export failed: ${e}`);
    }
    setExporting(false);
  };

  return (
    <AnimatePresence>
      {settingsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSettingsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="glass-strong rounded-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Settings</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Keyboard className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium">Hotkeys</h3>
                </div>
                <Card>
                  <CardContent className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quick Capture</span>
                      <kbd className="px-2 py-1 rounded bg-secondary text-xs font-mono">
                        {settings.hotkey}
                      </kbd>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium">AI (Ollama)</h3>
                </div>
                <Card>
                  <CardContent className="p-3 space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Endpoint</label>
                      <Input
                        value={settings.ollamaEndpoint}
                        onChange={(e) => updateSettings({ ollamaEndpoint: e.target.value })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Model</label>
                      <Input
                        value={settings.ollamaModel}
                        onChange={(e) => updateSettings({ ollamaModel: e.target.value })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" className="text-xs" onClick={checkOllama} disabled={checkingOllama}>
                        {checkingOllama ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Bot className="w-3 h-3 mr-1" />
                        )}
                        Test Connection
                      </Button>
                      {ollamaStatus === "connected" && (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <CheckCircle2 className="w-3 h-3" /> Connected
                        </span>
                      )}
                      {ollamaStatus === "disconnected" && (
                        <span className="flex items-center gap-1 text-xs text-destructive">
                          <XCircle className="w-3 h-3" /> Not found
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium">Focus Mode</h3>
                </div>
                <Card>
                  <CardContent className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Focus Duration</span>
                      <Input
                        type="number"
                        value={settings.focusDuration}
                        onChange={(e) => updateSettings({ focusDuration: parseInt(e.target.value) || 25 })}
                        className="h-8 w-20 text-xs text-right"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Short Break</span>
                      <Input
                        type="number"
                        value={settings.shortBreakDuration}
                        onChange={(e) => updateSettings({ shortBreakDuration: parseInt(e.target.value) || 5 })}
                        className="h-8 w-20 text-xs text-right"
                      />
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium">Storage</h3>
                </div>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      All data stored locally in SQLite. No cloud sync.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleExport("markdown")}
                        disabled={exporting}
                      >
                        <FileDown className="w-3 h-3 mr-1" />
                        {exporting ? "Exporting..." : "Export Markdown"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleExport("json")}
                        disabled={exporting}
                      >
                        <FileDown className="w-3 h-3 mr-1" />
                        {exporting ? "Exporting..." : "Export JSON"}
                      </Button>
                    </div>
                    {exportResult && (
                      <p className="text-xs text-primary/70 mt-2 break-all">{exportResult}</p>
                    )}
                  </CardContent>
                </Card>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium">Privacy</h3>
                </div>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm text-muted-foreground">
                      All processing is done locally. Your data never leaves your machine.
                      AI features require Ollama running locally.
                    </p>
                    <div className="mt-3">
                      <a
                        href="https://ollama.ai/download"
                        target="_blank"
                        className="text-xs text-primary hover:underline"
                      >
                        Download Ollama →
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
