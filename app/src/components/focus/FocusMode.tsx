import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useFocusStore } from "@/stores/focusStore";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Music,
  Volume2,
  VolumeX,
  Coffee,
  Zap,
  Brain,
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
    setTimerState,
    setTimeRemaining,
    setCurrentSession,
    setIsFocusMode,
    setAmbientSound,
  } = useFocusStore();

  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(Math.max(0, timeRemaining - 1));
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerState, timeRemaining, setTimeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const toggleTimer = () => {
    if (timerState === "idle" || timerState === "paused") {
      setTimerState("running");
    } else {
      setTimerState("paused");
    }
  };

  const resetTimer = () => {
    setTimerState("idle");
    setTimeRemaining(25 * 60);
  };

  const progress = 1 - timeRemaining / (25 * 60);

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
            <div
              className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5"
            />
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
                      strokeDasharray={`${progress * 283} 283`}
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

                <div className="flex gap-3">
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={toggleTimer}
                    className="w-32"
                  >
                    {timerState === "running" ? (
                      <><Pause className="w-4 h-4 mr-2" /> Pause</>
                    ) : (
                      <><Play className="w-4 h-4 mr-2" /> Start</>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={resetTimer}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
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
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Coffee className="w-4 h-4 mr-2" /> Take a break
              </Button>
              <Button
                variant={isFocusMode ? "secondary" : "outline"}
                className="w-full justify-start"
                size="sm"
                onClick={() => setIsFocusMode(!isFocusMode)}
              >
                <Brain className="w-4 h-4 mr-2" />
                {isFocusMode ? "Disable" : "Enable"} Website Blocker
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
