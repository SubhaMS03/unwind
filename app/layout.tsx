import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unwind — Stress Relief Puzzles",
  description: "Beautiful, calming puzzle games. Slide, match, breathe. Unwind your mind.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col items-center">{children}</body>
    </html>
  );
}
