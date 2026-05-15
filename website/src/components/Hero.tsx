"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Github, Sparkles, Shield, Cpu } from "lucide-react";

const platforms = [
  { name: "Windows", icon: "🪟", url: "#" },
  { name: "macOS", icon: "🍎", url: "#" },
  { name: "Linux", icon: "🐧", url: "#" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-cyan-500/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="section-padding text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Your AI Second Brain — Now Available</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-balance"
        >
          Your Thoughts,{" "}
          <span className="gradient-text">Amplified</span>
          <br />
          <span className="text-muted-foreground">with AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          A beautiful, privacy-first desktop app that captures your ideas, connects them
          with AI, and helps you think better. All processing is local and secure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          {platforms.map((p) => (
            <Button
              key={p.name}
              variant="gradient"
              size="xl"
              asChild
            >
              <a href={p.url}>
                <Download className="w-5 h-5 mr-2" />
                Download for {p.name}
              </a>
            </Button>
          ))}
          <Button variant="outline" size="xl" asChild>
            <a href="https://github.com/cogniflow/cogniflow" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              Source Code
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center gap-8 text-sm text-muted-foreground mb-16"
        >
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" /> 100% Private
          </span>
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" /> Local AI
          </span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Free & Open Source
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="glass-strong rounded-2xl overflow-hidden neon-glow">
            <div className="aspect-video bg-gradient-to-br from-purple-500/5 to-cyan-500/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <p className="text-xl gradient-text font-semibold">CogniFlow Dashboard</p>
                <p className="text-muted-foreground text-sm mt-2">App screenshot placeholder</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-3 -left-3 -right-3 h-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <a
            href="#features"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore Features <ArrowDown className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Brain(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 4a4 4 0 0 1 3.5 2.1 4 4 0 0 1 1.1 2.5 4 4 0 0 1 2.3 1.4 4 4 0 0 1-1.1 5.7 4 4 0 0 1-2.3.4 4 4 0 0 1-3.5 2.9 4 4 0 0 1-3.5-2.9 4 4 0 0 1-2.3-.4 4 4 0 0 1-1.1-5.7 4 4 0 0 1 2.3-1.4A4 4 0 0 1 8.5 6.1 4 4 0 0 1 12 4z" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
