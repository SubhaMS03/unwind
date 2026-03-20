'use client';

import Link from "next/link";
import { motion } from "motion/react";
import { useSound } from "@/app/hooks/useSound";

const GAMES = [
  {
    href: "/breathe", title: "Just Breathe", emoji: "🧘‍♀️",
    accent: "#8B7EC8", accentBg: "#F0EDF9",
    desc: "Guided breathing to calm your nervous system.",
    sub: "Box · 4-7-8 · Calm",
  },
  {
    href: "/match", title: "Memory Match", emoji: "🧠",
    accent: "#6A9FB5", accentBg: "#EDF5F8",
    desc: "Find matching pairs — a gentle brain workout.",
    sub: "Easy · Moderate · Hard",
  },
  {
    href: "/slide", title: "Slide Puzzle", emoji: "🏔️",
    accent: "#7BAF8E", accentBg: "#EFF6F1",
    desc: "Rearrange tiles to reveal calming landscapes.",
    sub: "3×3 · 4×4 · 5×5",
  },
];

export default function Home() {
  const { playClick } = useSound();

  return (
    <main className="flex-1 flex flex-col w-full">

      {/* NAV */}
      <nav className="w-full sticky top-0 z-50 bg-[#F9F7F4]/80 backdrop-blur-lg border-b border-[#E8E4DF]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8B7EC8] flex items-center justify-center text-white text-xs font-bold">U</div>
            <span className="font-bold text-[#2D2A26] text-lg tracking-tight">Unwind</span>
          </div>
          <Link
            href="/breathe"
            onClick={playClick}
            className="text-sm font-semibold text-[#8B7EC8] hover:text-[#6B5EA8] transition-colors"
          >
            Start now →
          </Link>
        </div>
      </nav>

      {/* HERO — generous vertical space */}
      <section className="w-full">
        <motion.div
          className="max-w-3xl mx-auto px-6 pt-24 sm:pt-36 pb-20 sm:pb-28 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 22 }}
        >
          <p className="text-sm font-medium text-[#8B7EC8] mb-6 tracking-wide">
            Free · No ads · No account
          </p>

          <h1 className="text-4xl sm:text-[56px] font-extrabold tracking-tight leading-[1.1] text-[#2D2A26] mb-6">
            Your mind deserves<br />
            <span className="text-[#8B7EC8]">a quiet moment.</span>
          </h1>

          <p className="text-lg text-[#8B8680] max-w-md mx-auto leading-relaxed mb-12">
            Three calming micro-games to help you decompress, refocus, and breathe.
          </p>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/breathe"
              onClick={playClick}
              className="inline-flex items-center gap-2.5 bg-[#8B7EC8] text-white font-semibold px-8 py-4 rounded-full text-sm shadow-lg shadow-[#8B7EC8]/20 hover:shadow-xl hover:shadow-[#8B7EC8]/30 transition-shadow"
            >
              Start breathing
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* GAME CARDS — clean, spacious, one column centered */}
      <section className="w-full">
        <div className="max-w-3xl mx-auto px-6 pb-24 sm:pb-32">
          <div className="space-y-4">
            {GAMES.map((game, i) => (
              <motion.div
                key={game.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 100, damping: 22, delay: i * 0.08 }}
              >
                <Link
                  href={game.href}
                  onClick={playClick}
                  className="group flex items-center gap-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-[#EBE8E4] hover:shadow-md hover:border-[#DDD9D4] transition-all duration-300"
                >
                  <div
                    className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl"
                    style={{ backgroundColor: game.accentBg }}
                  >
                    {game.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-[#2D2A26] mb-1">{game.title}</h3>
                    <p className="text-sm text-[#8B8680] leading-relaxed mb-2">{game.desc}</p>
                    <p className="text-xs font-medium text-[#B5B0AA]">{game.sub}</p>
                  </div>
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-[#CBC6C0] group-hover:text-[#8B7EC8] group-hover:translate-x-0.5 transition-all"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — simple 3 steps */}
      <section className="w-full bg-white border-y border-[#EBE8E4]">
        <div className="max-w-3xl mx-auto px-6 py-20 sm:py-28">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2A26]">How it works</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 text-center">
            {[
              { step: "1", title: "Pick a game", desc: "Breathing, memory, or puzzles.", icon: "🎯" },
              { step: "2", title: "Choose your level", desc: "Easy to hard — match your mood.", icon: "🎚️" },
              { step: "3", title: "Unwind", desc: "2–5 minutes. Feel calmer.", icon: "✨" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 22 }}
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <div className="text-xs font-bold text-[#CBC6C0] mb-2">Step {s.step}</div>
                <h3 className="text-base font-bold text-[#2D2A26] mb-1">{s.title}</h3>
                <p className="text-sm text-[#8B8680]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full">
        <motion.div
          className="max-w-3xl mx-auto px-6 py-24 sm:py-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-[#8B8680] italic text-lg leading-relaxed max-w-md mx-auto mb-12">
            &ldquo;Almost everything will work again if you unplug it for a few minutes — including you.&rdquo;
          </p>
          <p className="text-sm text-[#CBC6C0] mb-12">— Anne Lamott</p>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/breathe"
              onClick={playClick}
              className="inline-flex items-center gap-2.5 bg-[#2D2A26] text-white font-semibold px-8 py-4 rounded-full text-sm shadow-lg shadow-[#2D2A26]/10 hover:shadow-xl transition-shadow"
            >
              Start unwinding — it&apos;s free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#EBE8E4]">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#8B7EC8] flex items-center justify-center text-white text-[9px] font-bold">U</div>
            <span className="text-sm font-semibold text-[#CBC6C0]">Unwind</span>
          </div>
          <span className="text-xs text-[#CBC6C0]">Made with care for your peace of mind</span>
        </div>
      </footer>
    </main>
  );
}
