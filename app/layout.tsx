import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unwind — Stress Relief Puzzles",
  description: "Beautiful, calming puzzle games designed to help you decompress. Slide puzzles, memory match, guided breathing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" style={{ background: '#0a0a0f' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0a0f',
        color: '#e8e8ed',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}>
        {children}
      </body>
    </html>
  );
}
