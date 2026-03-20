import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unwind — Stress Relief Puzzles",
  description: "Beautiful, calming puzzle games. Slide, match, breathe. Unwind your mind.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ minHeight: '100%', width: '100%' }}>{children}</body>
    </html>
  );
}
