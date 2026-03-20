'use client';

import Link from "next/link";
import { motion } from "motion/react";
import { useSound } from "@/app/hooks/useSound";

const GAMES = [
  {
    href: "/breathe", title: "Just Breathe", emoji: "🧘‍♀️", accent: "#7C5CBF", accentText: "#C4A8FF",
    desc: "Guided breathing techniques used by therapists to calm your nervous system in minutes.",
    modes: ["Box Breathing", "4-7-8", "Calm Breath"], tall: true,
  },
  {
    href: "/match", title: "Memory Match", emoji: "🧠", accent: "#5B8DB8", accentText: "#82C9E5",
    desc: "Flip cards and find matching pairs. A gentle workout for your brain.",
    modes: ["4 pairs", "8 pairs", "12 pairs"],
  },
  {
    href: "/slide", title: "Slide Puzzle", emoji: "🏔️", accent: "#5BA87C", accentText: "#82C9A5",
    desc: "Rearrange tiles to reveal beautiful landscapes. Satisfying and calming.",
    modes: ["3×3 Easy", "4×4 Medium", "5×5 Hard"],
  },
];

const STATS = [
  { val: "3", label: "Calming games" },
  { val: "9", label: "Difficulty levels" },
  { val: "2–5 min", label: "Per session" },
  { val: "100%", label: "Free forever" },
];

const STEPS = [
  { num: "01", title: "Pick a game", desc: "Choose from breathing, memory match, or slide puzzles.", icon: "🎯" },
  { num: "02", title: "Set your level", desc: "Select the difficulty that matches your mood.", icon: "⚙️" },
  { num: "03", title: "Unwind", desc: "Play for 2–5 minutes. Feel calmer. Repeat.", icon: "✨" },
];

const BENEFITS = [
  { icon: "🧘", title: "Reduce Stress", desc: "Lower cortisol and quiet racing thoughts." },
  { icon: "🧠", title: "Sharpen Focus", desc: "Train attention span and working memory." },
  { icon: "💤", title: "Sleep Better", desc: "Prepare your body and mind for deep rest." },
  { icon: "⚡", title: "Quick Reset", desc: "2–5 minutes. Perfect for a work break." },
];

export default function Home() {
  const { playClick } = useSound();

  return (
    <main className="flex-1 flex flex-col w-full relative overflow-hidden">

      {/* MOOD LIGHTING */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#7C5CBF]/15 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#D4845A]/10 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#5B8DB8]/10 blur-[120px]" />
        <div className="absolute bottom-[30%] right-[30%] w-[300px] h-[300px] rounded-full bg-[#5BA87C]/8 blur-[100px]" />
      </div>

      {/* NAV */}
      <nav className="w-full sticky top-0 z-50 bg-[#0F0B15]/70 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CBF] to-[#5B3FA0] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#7C5CBF]/20">U</div>
            <span className="font-bold text-white text-lg tracking-tight">Unwind</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-white/50">
              <a href="#games" className="hover:text-white transition-colors">Games</a>
              <a href="#how" className="hover:text-white transition-colors">How it works</a>
              <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
            </div>
            <Link href="/breathe" className="text-sm font-semibold text-[#C4A8FF] hover:text-white transition-colors hidden sm:block">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full relative z-10">
        <motion.div
          className="max-w-6xl mx-auto px-6 sm:px-8 pt-20 sm:pt-32 pb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm text-[#C4A8FF] text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4A8FF] animate-pulse" />
            Free to play · No ads · No account needed
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6">
            Your mind deserves<br />
            <span className="bg-gradient-to-r from-[#C4A8FF] via-[#D4845A] to-[#82C9A5] bg-clip-text text-transparent">a break.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto leading-relaxed mb-12">
            Three beautifully crafted micro-games designed to help you decompress, refocus, and find your calm.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/breathe"
                onClick={playClick}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#7C5CBF] to-[#6A4DAD] text-white font-semibold px-8 py-4 rounded-full text-sm hover:shadow-xl hover:shadow-[#7C5CBF]/30 transition-shadow"
              >
                Start breathing exercise
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </motion.div>
            <a href="#games" className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors px-6 py-4">
              Explore all games
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </a>
          </div>
        </motion.div>
      </section>

      {/* BENTO TILES — Games */}
      <section id="games" className="w-full relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <p className="text-xs font-semibold text-[#C4A8FF] uppercase tracking-widest mb-3">Choose your calm</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Three ways to unwind</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAMES.map((game, i) => (
              <motion.div
                key={game.href}
                className={game.tall ? 'sm:row-span-2' : ''}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={game.href} onClick={playClick} className={`group h-full rounded-3xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] p-8 flex flex-col ${game.tall ? 'justify-between' : ''} hover:bg-white/[0.07] transition-colors duration-300 relative overflow-hidden`}>
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full blur-[60px] pointer-events-none" style={{ backgroundColor: `${game.accent}15` }} />
                  <div className="relative z-10">
                    <div className={`${game.tall ? 'text-5xl mb-6' : 'text-4xl mb-4'}`}>{game.emoji}</div>
                    <h3 className={`${game.tall ? 'text-2xl mb-3' : 'text-xl mb-2'} font-bold text-white`}>{game.title}</h3>
                    <p className={`text-sm text-white/40 leading-relaxed ${game.tall ? 'mb-6' : 'mb-4'}`}>{game.desc}</p>
                    <div className="flex gap-2 flex-wrap">
                      {game.modes.map(m => (
                        <span key={m} className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white/[0.06] text-white/50 border border-white/[0.06]">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-sm mt-auto pt-6 relative z-10" style={{ color: game.accentText }}>
                    Play now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="w-full relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.06] p-5 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="text-xl font-bold text-white">{s.val}</div>
                <div className="text-[11px] text-white/35 font-medium mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="w-full relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <motion.div className="text-center mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xs font-semibold text-[#D4845A] uppercase tracking-widest mb-3">Simple as 1-2-3</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">How it works</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.06] p-7 text-center hover:bg-white/[0.06] transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 100, damping: 20 }}
              >
                <div className="text-3xl mb-4">{step.icon}</div>
                <div className="text-xs font-bold text-white/20 mb-3">{step.num}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="w-full relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-16 sm:pb-24">
          <motion.div className="text-center mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xs font-semibold text-[#82C9A5] uppercase tracking-widest mb-3">Backed by science</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Why it works</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                className="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.06] p-6 hover:bg-white/[0.07] hover:border-white/[0.12] transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="text-2xl mb-4">{b.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1.5">{b.title}</h3>
                <p className="text-xs text-white/35 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-8">
          <motion.div
            className="rounded-3xl bg-gradient-to-br from-[#7C5CBF]/20 to-[#D4845A]/10 backdrop-blur-md border border-white/[0.08] px-8 sm:px-16 py-16 sm:py-20 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#7C5CBF]/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-[#D4845A]/10 blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to unwind?</h2>
              <p className="text-base text-white/40 mb-10 max-w-md mx-auto">No sign-up. No payment. Just pick a game and let your stress melt away.</p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/breathe"
                  onClick={playClick}
                  className="inline-flex items-center gap-2.5 bg-white text-[#0F0B15] font-bold px-8 py-4 rounded-full text-sm hover:shadow-xl hover:shadow-white/10 transition-shadow"
                >
                  Start now — it&apos;s free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="w-full relative z-10">
        <motion.div
          className="max-w-6xl mx-auto px-6 sm:px-8 py-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-xl mx-auto">
            <div className="text-3xl text-white/10 mb-4">&ldquo;</div>
            <p className="text-lg text-white/30 italic leading-relaxed mb-4">
              Almost everything will work again if you unplug it for a few minutes — including you.
            </p>
            <p className="text-sm font-medium text-white/15">Anne Lamott</p>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/[0.06] relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C5CBF] to-[#5B3FA0] flex items-center justify-center text-white text-[10px] font-bold">U</div>
            <span className="text-sm font-semibold text-white/30">Unwind</span>
          </div>
          <span className="text-xs text-white/15">Made with care for your peace of mind</span>
        </div>
      </footer>
    </main>
  );
}
