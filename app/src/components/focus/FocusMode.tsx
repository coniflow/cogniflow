import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFocusStore } from "@/stores/focusStore";
import { useAppStore } from "@/stores/appStore";
import { formatDate } from "@/lib/utils";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Music,
  Coffee,
  Zap,
  Brain,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const ambientSounds = [
  { id: "rain", label: "Rain", icon: "🌧️" },
  { id: "forest", label: "Forest", icon: "🌲" },
  { id: "waves", label: "Ocean", icon: "🌊" },
  { id: "cafe", label: "Café", icon: "☕" },
  { id: "white", label: "White Noise", icon: "🤍" },
  { id: "lofi", label: "Lo-Fi", icon: "🎵" },
];

export function FocusMode() {
  const {
    timerState,
    timeRemaining,
    currentSession,
    isFocusMode,
    ambientSound,
    totalToday,
    sessions,
    setTimerState,
    setTimeRemaining,
    setCurrentSession,
    setIsFocusMode,
    setAmbientSound,
    completeSession,
    loadSessions,
  } = useFocusStore();

  const { settings } = useAppStore();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const focusDuration = settings.focusDuration || 25;

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        const remaining = useFocusStore.getState().timeRemaining;
        if (remaining <= 1) {
          clearInterval(intervalRef.current);
          setTimerState("completed");
          completeSession();
          playNotification();
        } else {
          setTimeRemaining(remaining - 1);
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerState]);

  const playNotification = () => {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAf39/f4B/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgICA"
      );
      audio.volume = 0.3;
      audio.play();
    } catch {}
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const toggleTimer = () => {
    if (timerState === "idle" || timerState === "paused") {
      setTimerState("running");
    } else if (timerState === "running") {
      setTimerState("paused");
    } else {
      setTimerState("idle");
      setTimeRemaining(focusDuration * 60);
    }
  };

  const resetTimer = () => {
    setTimerState("idle");
    setTimeRemaining(focusDuration * 60);
  };

  const progress = 1 - timeRemaining / (focusDuration * 60);

  return (
    <div className="p-6 space-y-8 overflow-y-auto h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Timer className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Focus Mode</h1>
        </div>
        <p className="text-muted-foreground">Deep work. No distractions.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />
            <CardContent className="p-8 relative">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.max(0, progress * 283)} 283`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-5xl font-bold tabular-nums tracking-tight">
                        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Session {currentSession}
                      </p>
                    </div>
                  </div>
                </div>

                {timerState === "completed" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mb-4 flex items-center gap-2 text-green-400"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Session Complete!</span>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={toggleTimer}
                    className="w-32"
                  >
                    {timerState === "running" ? (
                      <><Pause className="w-4 h-4 mr-2" /> Pause</>
                    ) : timerState === "completed" ? (
                      <><RotateCcw className="w-4 h-4 mr-2" /> Again</>
                    ) : (
                      <><Play className="w-4 h-4 mr-2" /> Start</>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={resetTimer}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-4 flex gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-primary">{totalToday}</p>
                    <p className="text-[10px] text-muted-foreground">Today</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-cyan-400">{sessions.length}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-400">
                      {Math.floor(sessions.reduce((sum, s) => sum + s.duration, 0) / 60)}m
                    </p>
                    <p className="text-[10px] text-muted-foreground">Tracked</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                Ambient Sounds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {ambientSounds.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() =>
                      setAmbientSound(ambientSound === sound.id ? null : sound.id)
                    }
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${
                      ambientSound === sound.id
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"
                    }`}
                  >
                    <span className="text-xl">{sound.icon}</span>
                    <p className="text-xs mt-1">{sound.label}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => {
                  const breakDuration = (settings.shortBreakDuration || 5) * 60;
                  setTimeRemaining(breakDuration);
                  setTimerState("idle");
                }}
              >
                <Coffee className="w-4 h-4 mr-2" /> Take a break (5m)
              </Button>
              <Button
                variant={isFocusMode ? "secondary" : "outline"}
                className="w-full justify-start"
                size="sm"
                onClick={() => setIsFocusMode(!isFocusMode)}
              >
                <Brain className="w-4 h-4 mr-2" />
                {isFocusMode ? "Disable" : "Enable"} Focus Mode
              </Button>
            </CardContent>
          </Card>

          {sessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sessions.slice(0, 10).map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{formatDate(s.started_at)}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {Math.floor(s.duration / 60)}m
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
