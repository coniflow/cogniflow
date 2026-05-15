import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Settings,
  Keyboard,
  Bot,
  Palette,
  Timer,
  Database,
  Shield,
} from "lucide-react";

export function SettingsPanel() {
  const { settingsOpen, setSettingsOpen, settings, updateSettings } = useAppStore();

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
                      <span className="text-sm font-mono">{settings.focusDuration}m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Short Break</span>
                      <span className="text-sm font-mono">{settings.shortBreakDuration}m</span>
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
                    <p className="text-sm text-muted-foreground">
                      All data stored locally in SQLite. No cloud sync.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="text-xs">
                        Export as Markdown
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Export as JSON
                      </Button>
                    </div>
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
                    </p>
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
