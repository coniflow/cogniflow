import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CogniFlow - Your AI Second Brain",
  description:
    "A beautiful, privacy-first personal AI companion that captures, connects, and enhances your thoughts. Your second brain, reimagined.",
  keywords: ["ai", "second brain", "notes", "knowledge graph", "privacy", "productivity"],
  openGraph: {
    title: "CogniFlow - Your AI Second Brain",
    description: "A beautiful, privacy-first personal AI companion for your thoughts.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
