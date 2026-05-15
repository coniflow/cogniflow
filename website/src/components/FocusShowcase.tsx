"use client";

import { motion } from "framer-motion";
import { Timer, Music, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Timer,
    title: "Pomodoro Timer",
    description: "Customizable focus sessions with short and long breaks.",
  },
  {
    icon: Music,
    title: "Ambient Sounds",
    description: "Rain, forest, ocean, and lo-fi beats to help you concentrate.",
  },
  {
    icon: Shield,
    title: "Website Blocker",
    description: "Block distracting sites during focus sessions.",
  },
  {
    icon: Zap,
    title: "Deep Work Stats",
    description: "Track your focus hours and patterns over time.",
  },
];

export function FocusShowcase() {
  return (
    <section id="focus" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/3 to-transparent" />

      <div className="section-padding relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Enter{" "}
              <span className="gradient-text">Flow State</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Focus mode combines a Pomodoro timer with ambient sounds and a
              distraction-free environment. Your most productive self, delivered.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{f.title}</h4>
                    <p className="text-xs text-muted-foreground">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="gradient">Try Focus Mode</Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="glass-strong rounded-2xl p-8 neon-glow">
              <div className="flex flex-col items-center">
                <svg className="w-48 h-48 mb-4" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle
                    cx="50" cy="50" r="45" fill="none"
                    stroke="url(#focusGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="200 283"
                  />
                  <defs>
                    <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold tabular-nums mb-1">25:00</div>
                  <p className="text-sm text-muted-foreground">Session 1 of 4</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <div className="w-3 h-3 rounded-full bg-muted" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
