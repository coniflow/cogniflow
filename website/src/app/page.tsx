"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { GraphDemo } from "@/components/GraphDemo";
import { FocusShowcase } from "@/components/FocusShowcase";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <GraphDemo />
      <FocusShowcase />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
