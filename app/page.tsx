'use client';

import Link from "next/link";
import { motion } from "motion/react";
import { useSound } from "@/app/hooks/useSound";

const GAMES = [
  {
    href: "/breathe", title: "Just Breathe", emoji: "🧘‍♀️",
    bg: "#F47C48", bgLight: "#FEF0E8",
    desc: "Calm your nervous system with guided breathing.",
    sub: "Box · 4-7-8 · Calm",
  },
  {
    href: "/match", title: "Memory Match", emoji: "🧠",
    bg: "#5BB5D5", bgLight: "#E8F5FA",
    desc: "Flip cards and find pairs. A gentle brain workout.",
    sub: "Easy · Moderate · Hard",
  },
  {
    href: "/slide", title: "Slide Puzzle", emoji: "🏔️",
    bg: "#6DC29B", bgLight: "#E8F6EF",
    desc: "Rearrange tiles to reveal beautiful landscapes.",
    sub: "3×3 · 4×4 · 5×5",
  },
];

export default function Home() {
  const { playClick } = useSound();

  return (
    <main className="flex-1 flex flex-col w-full">

      {/* NAV */}
      <nav className="w-full sticky top-0 z-50 bg-[#FEF8F0]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F47C48] flex items-center justify-center text-white text-sm font-bold shadow-md shadow-[#F47C48]/25">U</div>
            <span className="font-extrabold text-[#2D2A26] text-xl tracking-tight">Unwind</span>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/breathe"
              onClick={playClick}
              className="text-sm font-bold bg-[#2D2A26] text-white px-6 py-2.5 rounded-full hover:bg-[#3D3A36] transition-colors"
            >
              Get started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 22 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#F47C48]/10 text-[#F47C48] text-xs font-bold px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F47C48]" />
              Free forever · No ads · No sign-up
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#2D2A26] mb-6">
              Be kind to<br />your mind.
            </h1>

            <p className="text-lg sm:text-xl text-[#6B6560] leading-relaxed mb-10 max-w-lg">
              Three beautifully crafted micro-games designed to help you decompress, refocus, and find calm in just a few minutes.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/breathe"
                  onClick={playClick}
                  className="inline-flex items-center gap-2 bg-[#F47C48] text-white font-bold px-8 py-4 rounded-full text-base shadow-lg shadow-[#F47C48]/25 hover:shadow-xl hover:shadow-[#F47C48]/30 transition-shadow"
                >
                  Start breathing
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </motion.div>
              <span className="text-sm text-[#A8A29E]">Takes 2 minutes</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GAME CARDS — bold colorful cards */}
      <section className="w-full">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 pb-20 sm:pb-28">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {GAMES.map((game, i) => (
              <motion.div
                key={game.href}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 100, damping: 22, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={game.href}
                  onClick={playClick}
                  className="group flex flex-col h-full rounded-3xl p-7 sm:p-8 transition-shadow duration-300 hover:shadow-xl"
                  style={{ backgroundColor: game.bg }}
                >
                  <div className="text-4xl mb-5 w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    {game.emoji}
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-2">{game.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-6 flex-1">{game.desc}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white/50">{game.sub}</p>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — warm cream section */}
      <section className="w-full bg-[#F47C48]/[0.06] rounded-t-[40px]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D2A26]">Simple as 1-2-3</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Pick a game", desc: "Choose from breathing exercises, memory match, or slide puzzles.", icon: "🎯", color: "#F47C48" },
              { step: "2", title: "Set your level", desc: "Select the difficulty that matches your mood.", icon: "🎚️", color: "#5BB5D5" },
              { step: "3", title: "Unwind", desc: "Play for 2–5 minutes. Feel calmer. Repeat.", icon: "✨", color: "#6DC29B" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                className="text-center bg-white rounded-3xl p-8 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 100, damping: 22 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
                  style={{ backgroundColor: `${s.color}15` }}
                >
                  {s.icon}
                </div>
                <div className="text-xs font-extrabold mb-3 w-7 h-7 rounded-full mx-auto flex items-center justify-center text-white" style={{ backgroundColor: s.color }}>{s.step}</div>
                <h3 className="text-lg font-extrabold text-[#2D2A26] mb-2">{s.title}</h3>
                <p className="text-sm text-[#6B6560] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[#F47C48] rounded-b-none">
        <motion.div
          className="max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-white/70 italic text-lg sm:text-xl leading-relaxed max-w-lg mx-auto mb-4">
            &ldquo;Almost everything will work again if you unplug it for a few minutes — including you.&rdquo;
          </p>
          <p className="text-sm text-white/40 mb-12">— Anne Lamott</p>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/breathe"
              onClick={playClick}
              className="inline-flex items-center gap-2.5 bg-white text-[#F47C48] font-extrabold px-10 py-4 rounded-full text-base shadow-lg shadow-black/10 hover:shadow-xl transition-shadow"
            >
              Start unwinding — it&apos;s free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#2D2A26]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F47C48] flex items-center justify-center text-white text-[10px] font-bold">U</div>
            <span className="text-sm font-bold text-white/50">Unwind</span>
          </div>
          <span className="text-xs text-white/30">Made with care for your peace of mind</span>
        </div>
      </footer>
    </main>
  );
}
