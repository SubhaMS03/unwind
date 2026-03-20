import Link from "next/link";

const GAMES = [
  {
    href: "/slide",
    icon: "🧩",
    title: "Slide Puzzle",
    description: "Rearrange tiles to reveal beautiful landscape photos",
    modes: ["Easy", "Moderate", "Hard"],
    color: "from-violet-500/10 to-violet-600/5",
    accent: "bg-violet-500/10 text-violet-400",
    ring: "group-hover:ring-violet-500/20",
  },
  {
    href: "/match",
    icon: "🃏",
    title: "Memory Match",
    description: "Flip cards and find all matching pairs",
    modes: ["4 pairs", "8 pairs", "12 pairs"],
    color: "from-blue-500/10 to-blue-600/5",
    accent: "bg-blue-500/10 text-blue-400",
    ring: "group-hover:ring-blue-500/20",
  },
  {
    href: "/breathe",
    icon: "🌬️",
    title: "Just Breathe",
    description: "Guided breathing to calm your nervous system",
    modes: ["Box", "4-7-8", "Calm"],
    color: "from-emerald-500/10 to-emerald-600/5",
    accent: "bg-emerald-500/10 text-emerald-400",
    ring: "group-hover:ring-emerald-500/20",
  },
];

const BENEFITS = [
  { icon: "🧘", title: "Reduce Stress", desc: "Tactile puzzles proven to lower cortisol and quiet racing thoughts." },
  { icon: "🧠", title: "Sharpen Focus", desc: "Memory games that train attention span and working memory." },
  { icon: "💤", title: "Sleep Better", desc: "Breathing exercises used by therapists to prepare your body for rest." },
  { icon: "⚡", title: "Quick Reset", desc: "Each session takes 2–5 minutes. Perfect for a work break or commute." },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full">

      {/* NAV */}
      <nav className="w-full border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">U</div>
            <span className="font-semibold text-white text-lg tracking-tight">Unwind</span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-sm text-white/40">
            <a href="#games" className="hover:text-white/70 transition-colors">Games</a>
            <a href="#benefits" className="hover:text-white/70 transition-colors">Benefits</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full">
        <div className="max-w-6xl mx-auto px-6 pt-20 sm:pt-28 pb-16 sm:pb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-white/50 border border-white/8 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Free to play · No ads · No account
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-white mb-5">
              Puzzles designed{' '}
              <span className="gradient-text">to calm your mind.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/40 leading-relaxed max-w-md mb-8">
              Three beautifully crafted games to help you decompress, refocus, and find your calm.
            </p>
            <Link href="/slide" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
              Start playing
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section id="games" className="w-full border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">Choose your calm</h2>
            <p className="text-sm text-white/35">Three different ways to unwind. Pick what feels right.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GAMES.map((game) => (
              <Link
                key={game.href}
                href={game.href}
                className={`group relative rounded-2xl p-6 border border-white/5 bg-gradient-to-b ${game.color} transition-all duration-300 hover:border-white/10 ring-1 ring-transparent ${game.ring}`}
              >
                <div className={`w-12 h-12 rounded-xl ${game.accent} flex items-center justify-center text-2xl mb-4`}>
                  {game.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1.5">{game.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">{game.description}</p>
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {game.modes.map(m => (
                    <span key={m} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/30">
                      {m}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-white/30 group-hover:text-white/60 transition-colors flex items-center gap-1.5">
                  Play
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="w-full border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">Why it works</h2>
            <p className="text-sm text-white/35">Simple activities with real impact on your mental wellbeing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
                <div className="text-2xl mb-3">{b.icon}</div>
                <h3 className="text-base font-semibold text-white mb-1.5">{b.title}</h3>
                <p className="text-sm text-white/30 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="w-full border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">3</div>
              <div className="text-sm text-white/30 mt-1">Games</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">9</div>
              <div className="text-sm text-white/30 mt-1">Difficulty modes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-sm text-white/30 mt-1">Plays</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">Ready to unwind?</h2>
          <p className="text-sm text-white/35 mb-8 max-w-md mx-auto">No sign-up required. Just pick a game and start playing. Your calm is one click away.</p>
          <Link href="/slide" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm">
            Start now — it&apos;s free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* QUOTE */}
      <section className="w-full border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <p className="text-sm text-white/20 italic leading-relaxed max-w-lg mx-auto">
            &ldquo;Almost everything will work again if you unplug it for a few minutes — including you.&rdquo;
          </p>
          <p className="text-xs text-white/15 mt-2">— Anne Lamott</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">U</div>
            <span className="text-sm text-white/40">Unwind</span>
          </div>
          <span className="text-xs text-white/20">Made with care</span>
        </div>
      </footer>
    </main>
  );
}
