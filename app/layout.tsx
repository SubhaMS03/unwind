import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Unwind — Stress Relief Puzzles",
  description: "Beautiful, calming puzzle games designed to help you decompress. Slide puzzles, memory match, guided breathing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#FEF8F0',
        color: '#2D2A26',
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
