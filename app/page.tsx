import Link from "next/link";

const GAMES = [
  {
    href: "/breathe",
    title: "Just Breathe",
    description: "Guided breathing techniques used by therapists to calm your nervous system in minutes.",
    modes: ["Box Breathing", "4-7-8", "Calm Breath"],
    gradient: "from-[#E8E0F5] to-[#D6C8F0]",
    accent: "#7C5CBF",
    illustration: "🧘‍♀️",
  },
  {
    href: "/match",
    title: "Memory Match",
    description: "Flip cards and find matching pairs. A gentle workout for your brain that melts stress away.",
    modes: ["4 pairs", "8 pairs", "12 pairs"],
    gradient: "from-[#D6EAF0] to-[#BDD9E8]",
    accent: "#5B8DB8",
    illustration: "🧠",
  },
  {
    href: "/slide",
    title: "Slide Puzzle",
    description: "Rearrange tiles to reveal beautiful landscapes. Satisfying, tactile, and deeply calming.",
    modes: ["3×3 Easy", "4×4 Medium", "5×5 Hard"],
    gradient: "from-[#D9EFE0] to-[#BFE3CA]",
    accent: "#5BA87C",
    illustration: "🏔️",
  },
];

const STEPS = [
  { num: "01", title: "Pick a game", desc: "Choose from breathing exercises, memory match, or slide puzzles." },
  { num: "02", title: "Set your level", desc: "Select the difficulty that matches your mood and energy." },
  { num: "03", title: "Unwind", desc: "Play for 2–5 minutes. Feel calmer. Repeat anytime." },
];

const BENEFITS = [
  { icon: "🧘", title: "Reduce Stress", desc: "Tactile puzzles proven to lower cortisol and quiet racing thoughts." },
  { icon: "🧠", title: "Sharpen Focus", desc: "Memory games that train attention span and working memory." },
  { icon: "💤", title: "Sleep Better", desc: "Breathing exercises that prepare your body and mind for rest." },
  { icon: "⚡", title: "Quick Reset", desc: "Each session takes 2–5 minutes. Perfect for a work break." },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full">

      {/* NAV */}
      <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2DED9]/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CBF] to-[#5B3FA0] flex items-center justify-center text-white text-sm font-bold shadow-sm">U</div>
            <span className="font-bold text-[#2D2C2B] text-lg tracking-tight">Unwind</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-[#7A7672]">
              <a href="#games" className="hover:text-[#2D2C2B] transition-colors">Games</a>
              <a href="#how" className="hover:text-[#2D2C2B] transition-colors">How it works</a>
              <a href="#benefits" className="hover:text-[#2D2C2B] transition-colors">Benefits</a>
            </div>
            <Link
              href="/breathe"
              className="text-sm font-semibold text-[#7C5CBF] hover:text-[#5B3FA0] transition-colors hidden sm:block"
            >
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#E8E0F5]/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#D9EFE0]/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-32 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#F5F0FB] text-[#7C5CBF] text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CBF] animate-pulse" />
            Free to play · No ads · No account needed
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#2D2C2B] mb-6">
            Your mind deserves<br />
            <span className="bg-gradient-to-r from-[#7C5CBF] to-[#5B8DB8] bg-clip-text text-transparent">a break.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#7A7672] max-w-xl mx-auto leading-relaxed mb-10">
            Three beautifully crafted micro-games designed to help you decompress, refocus, and find your calm — in under 5 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/breathe"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#7C5CBF] to-[#6A4DAD] text-white font-semibold px-8 py-4 rounded-full text-sm hover:shadow-lg hover:shadow-[#7C5CBF]/25 hover:-translate-y-0.5 transition-all"
            >
              Start breathing exercise
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <a
              href="#games"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A7672] hover:text-[#2D2C2B] transition-colors px-6 py-4"
            >
              Explore all games
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="w-full border-y border-[#E2DED9]/60 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
            <div>
              <div className="text-2xl font-bold text-[#2D2C2B]">3</div>
              <div className="text-xs text-[#9A9691] font-medium mt-0.5">Calming games</div>
            </div>
            <div className="w-px h-8 bg-[#E2DED9] hidden sm:block" />
            <div>
              <div className="text-2xl font-bold text-[#2D2C2B]">9</div>
              <div className="text-xs text-[#9A9691] font-medium mt-0.5">Difficulty levels</div>
            </div>
            <div className="w-px h-8 bg-[#E2DED9] hidden sm:block" />
            <div>
              <div className="text-2xl font-bold text-[#2D2C2B]">2–5 min</div>
              <div className="text-xs text-[#9A9691] font-medium mt-0.5">Per session</div>
            </div>
            <div className="w-px h-8 bg-[#E2DED9] hidden sm:block" />
            <div>
              <div className="text-2xl font-bold text-[#2D2C2B]">100%</div>
              <div className="text-xs text-[#9A9691] font-medium mt-0.5">Free forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section id="games" className="w-full">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-[#7C5CBF] uppercase tracking-widest mb-3">Choose your calm</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2C2B] mb-3">Three ways to unwind</h2>
            <p className="text-base text-[#7A7672] max-w-lg mx-auto">Each game is designed with care to reduce stress and improve focus. Pick what feels right.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {GAMES.map((game) => (
              <Link
                key={game.href}
                href={game.href}
                className="group relative rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${game.gradient} p-8 pb-6`}>
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{game.illustration}</div>
                  <h3 className="text-xl font-bold text-[#2D2C2B] mb-2">{game.title}</h3>
                  <p className="text-sm text-[#5A5856] leading-relaxed mb-5">{game.description}</p>
                  <div className="flex gap-2 flex-wrap mb-6">
                    {game.modes.map(m => (
                      <span key={m} className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/70 text-[#5A5856] backdrop-blur-sm">
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: game.accent }}>
                    Play now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-[#7C5CBF] uppercase tracking-widest mb-3">Simple as 1-2-3</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2C2B] mb-3">How it works</h2>
            <p className="text-base text-[#7A7672]">No sign-up. No setup. Just start.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map((step, i) => (
              <div key={step.num} className="text-center relative">
                {i < 2 && <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-[#E2DED9]" />}
                <div className="w-16 h-16 rounded-2xl bg-[#F5F0FB] flex items-center justify-center text-[#7C5CBF] font-bold text-lg mx-auto mb-5">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[#2D2C2B] mb-2">{step.title}</h3>
                <p className="text-sm text-[#7A7672] leading-relaxed max-w-[260px] mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="w-full">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-[#7C5CBF] uppercase tracking-widest mb-3">Backed by science</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2C2B] mb-3">Why it works</h2>
            <p className="text-base text-[#7A7672] max-w-lg mx-auto">Simple activities with real, measurable impact on your wellbeing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl p-7 bg-white border border-[#E2DED9]/60 hover:border-[#7C5CBF]/30 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#F5F0FB] flex items-center justify-center text-2xl mb-5">{b.icon}</div>
                <h3 className="text-base font-bold text-[#2D2C2B] mb-2">{b.title}</h3>
                <p className="text-sm text-[#7A7672] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-6">
          <div className="rounded-3xl bg-gradient-to-br from-[#7C5CBF] to-[#5B3FA0] px-8 sm:px-16 py-16 sm:py-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to unwind?</h2>
              <p className="text-base text-white/70 mb-10 max-w-md mx-auto">No sign-up. No payment. Just pick a game and let your stress melt away.</p>
              <Link
                href="/breathe"
                className="inline-flex items-center gap-2.5 bg-white text-[#7C5CBF] font-bold px-8 py-4 rounded-full text-sm hover:bg-white/90 hover:shadow-lg transition-all"
              >
                Start now — it&apos;s free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 text-center">
          <div className="max-w-xl mx-auto">
            <div className="text-4xl text-[#E2DED9] mb-4">&ldquo;</div>
            <p className="text-lg text-[#7A7672] italic leading-relaxed mb-4">
              Almost everything will work again if you unplug it for a few minutes — including you.
            </p>
            <p className="text-sm font-medium text-[#B5B1AD]">Anne Lamott</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#E2DED9]/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C5CBF] to-[#5B3FA0] flex items-center justify-center text-white text-[10px] font-bold">U</div>
            <span className="text-sm font-semibold text-[#7A7672]">Unwind</span>
          </div>
          <span className="text-xs text-[#B5B1AD]">Made with care for your peace of mind</span>
        </div>
      </footer>
    </main>
  );
}
