"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  Share2,
  Timer,
  Search,
  Shield,
  Keyboard,
  Download,
  Mic,
  Camera,
} from "lucide-react";

const features = [
  {
    icon: Keyboard,
    title: "Quick Capture",
    description:
      "Press Ctrl+Shift+C anywhere to instantly capture thoughts, voice notes, or screenshots. Never lose an idea again.",
  },
  {
    icon: Brain,
    title: "AI Processing",
    description:
      "Local AI (Ollama) summarizes, tags, and extracts entities from your notes. Private and fast.",
  },
  {
    icon: Share2,
    title: "Knowledge Graph",
    description:
      "Watch your ideas connect. Interactive graph shows relationships between notes, tags, and concepts.",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Search across all your notes with AI-powered semantic understanding. Find what you need, fast.",
  },
  {
    icon: Timer,
    title: "Focus Mode",
    description:
      "Pomodoro timer with ambient sounds and optional website blocker. Deep work, no distractions.",
  },
  {
    icon: Shield,
    title: "100% Private",
    description:
      "Everything runs locally. SQLite database, local AI, no cloud dependency. Your data stays yours.",
  },
  {
    icon: Mic,
    title: "Voice Recording",
    description:
      "Record voice notes that get automatically transcribed and processed. Speak your thoughts.",
  },
  {
    icon: Camera,
    title: "Screenshot OCR",
    description:
      "Capture screenshots and extract text using OCR. Save visual information as searchable notes.",
  },
  {
    icon: Download,
    title: "Export Any Time",
    description:
      "Export all notes as Markdown or JSON. Full data portability with no lock-in.",
  },
];

export function Features() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/3 to-transparent" />

      <div className="section-padding relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Think Better</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Capture, connect, and reflect on your ideas with powerful tools that work
            together seamlessly.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group"
            >
              <div className="glass rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
