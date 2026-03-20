'use client';

import Link from "next/link";
import { motion } from "motion/react";
import { useSound } from "@/app/hooks/useSound";

const GAMES = [
  {
    href: "/breathe", title: "Just Breathe", emoji: "🧘‍♀️",
    accent: "#8B7EC8", accentBg: "#F0EDF9",
    desc: "Guided breathing techniques used by therapists to calm your nervous system in minutes.",
    sub: "Box · 4-7-8 · Calm",
  },
  {
    href: "/match", title: "Memory Match", emoji: "🧠",
    accent: "#6A9FB5", accentBg: "#EDF5F8",
    desc: "Flip cards and find matching pairs. A gentle workout for your brain that sharpens focus.",
    sub: "Easy · Moderate · Hard",
  },
  {
    href: "/slide", title: "Slide Puzzle", emoji: "🏔️",
    accent: "#7BAF8E", accentBg: "#EFF6F1",
    desc: "Rearrange tiles to reveal beautiful landscapes. Satisfying, meditative, calming.",
    sub: "3×3 · 4×4 · 5×5",
  },
];

export default function Home() {
  const { playClick } = useSound();

  return (
    <main className="flex-1 flex flex-col w-full">

      {/* NAV */}
      <nav className="w-full sticky top-0 z-50 bg-[#F9F7F4]/80 backdrop-blur-lg border-b border-[#E8E4DF]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
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

      {/* HERO — full viewport height, only thing you see on load */}
      <section className="w-full min-h-[85vh] flex items-center justify-center">
        <motion.div
          className="max-w-2xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 22 }}
        >
          <p className="text-sm font-medium text-[#8B7EC8] mb-8 tracking-wide">
            Free · No ads · No account
          </p>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#2D2A26] mb-8">
            Your mind<br />deserves
            <span className="text-[#8B7EC8]"> a quiet<br />moment.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#8B8680] max-w-md mx-auto leading-relaxed mb-14">
            Three calming micro-games to help you decompress, refocus, and breathe.
          </p>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/breathe"
              onClick={playClick}
              className="inline-flex items-center gap-2.5 bg-[#8B7EC8] text-white font-semibold px-10 py-4 rounded-full text-base shadow-lg shadow-[#8B7EC8]/20 hover:shadow-xl hover:shadow-[#8B7EC8]/30 transition-shadow"
            >
              Start breathing
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* GAME CARDS — real cards with depth, 3-column grid on desktop */}
      <section className="w-full bg-white border-y border-[#EBE8E4]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B7EC8] text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Choose your calm
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-[#2D2A26] text-center mb-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Three ways to unwind
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {GAMES.map((game, i) => (
              <motion.div
                key={game.href}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 100, damping: 22, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  href={game.href}
                  onClick={playClick}
                  className="group flex flex-col h-full rounded-2xl bg-[#F9F7F4] p-7 sm:p-8 border border-[#EBE8E4] hover:shadow-lg hover:border-[#DDD9D4] transition-all duration-300"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                    style={{ backgroundColor: game.accentBg }}
                  >
                    {game.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-[#2D2A26] mb-2">{game.title}</h3>
                  <p className="text-sm text-[#8B8680] leading-relaxed mb-5 flex-1">{game.desc}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-[#B5B0AA]">{game.sub}</p>
                    <svg
                      className="w-5 h-5 text-[#CBC6C0] group-hover:text-[#8B7EC8] group-hover:translate-x-1 transition-all"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7BAF8E] text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Simple as 1-2-3
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-[#2D2A26] text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How it works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
            {[
              { step: "01", title: "Pick a game", desc: "Choose from breathing exercises, memory match, or slide puzzles.", icon: "🎯" },
              { step: "02", title: "Set your level", desc: "Select the difficulty that matches your mood right now.", icon: "🎚️" },
              { step: "03", title: "Unwind", desc: "Play for 2–5 minutes. Feel calmer. Come back anytime.", icon: "✨" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 100, damping: 22 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#EBE8E4] flex items-center justify-center text-2xl mx-auto mb-5 shadow-sm">{s.icon}</div>
                <div className="text-xs font-bold text-[#CBC6C0] mb-2">{s.step}</div>
                <h3 className="text-lg font-bold text-[#2D2A26] mb-2">{s.title}</h3>
                <p className="text-sm text-[#8B8680] leading-relaxed max-w-[240px] mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[#2D2A26]">
        <motion.div
          className="max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-white/50 italic text-lg sm:text-xl leading-relaxed max-w-lg mx-auto mb-6">
            &ldquo;Almost everything will work again if you unplug it for a few minutes — including you.&rdquo;
          </p>
          <p className="text-sm text-white/30 mb-14">— Anne Lamott</p>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/breathe"
              onClick={playClick}
              className="inline-flex items-center gap-2.5 bg-white text-[#2D2A26] font-semibold px-10 py-4 rounded-full text-base shadow-lg shadow-black/10 hover:shadow-xl transition-shadow"
            >
              Start unwinding — it&apos;s free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#EBE8E4]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8 flex items-center justify-between">
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
