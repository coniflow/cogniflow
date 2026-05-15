"use client";

import { motion } from "framer-motion";
import { Share2, ZoomIn } from "lucide-react";

export function GraphDemo() {
  return (
    <section id="demo" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/3 to-transparent" />

      <div className="section-padding relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            See Your Ideas{" "}
            <span className="gradient-text">Come Alive</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The interactive knowledge graph visualizes connections between your notes,
            making it easy to discover new relationships and insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-2xl overflow-hidden neon-glow"
        >
          <div className="aspect-[16/9] bg-gradient-to-br from-purple-500/5 via-background to-cyan-500/5 relative">
            {/* Simulated graph nodes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                <div className="absolute top-1/4 left-1/3 w-20 h-20 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center animate-float">
                  <span className="text-xs text-purple-300 font-medium">Ideas</span>
                </div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center" style={{ animationDelay: "1s" }}>
                  <span className="text-xs text-cyan-300 font-medium">Notes</span>
                </div>
                <div className="absolute bottom-1/3 left-1/4 w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center" style={{ animationDelay: "2s" }}>
                  <span className="text-xs text-amber-300 font-medium">Tags</span>
                </div>
                <div className="absolute top-1/3 right-1/3 w-12 h-12 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center" style={{ animationDelay: "0.5s" }}>
                  <span className="text-[10px] text-green-300 font-medium">AI</span>
                </div>

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
                  <line x1="33%" y1="25%" x2="75%" y2="50%" stroke="rgba(139,92,246,0.2)" strokeWidth="2" strokeDasharray="6 4" />
                  <line x1="75%" y1="50%" x2="25%" y2="33%" stroke="rgba(6,182,212,0.2)" strokeWidth="2" strokeDasharray="6 4" />
                  <line x1="33%" y1="25%" x2="25%" y2="33%" stroke="rgba(245,158,11,0.2)" strokeWidth="2" />
                  <line x1="33%" y1="25%" x2="33%" y2="25%" stroke="rgba(34,197,94,0.2)" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 text-xs text-muted-foreground flex items-center gap-1.5">
                <ZoomIn className="w-3 h-3" /> Interactive
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 text-xs text-muted-foreground flex items-center gap-1.5">
                <Share2 className="w-3 h-3" /> 247 connections
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
