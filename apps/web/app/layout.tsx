import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillForge — Forge Your Career Path",
  description:
    "Discover your real skill gaps, get AI-powered roadmaps, and prove your abilities through boss battles.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
