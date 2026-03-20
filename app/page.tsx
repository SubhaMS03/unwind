import Link from "next/link";

const GAMES = [
  {
    href: "/slide",
    icon: "🧩",
    title: "Slide Puzzle",
    description: "Rearrange tiles to reveal beautiful landscape photos. Choose your scene and difficulty.",
    modes: ["Easy", "Moderate", "Hard"],
    gradient: "from-violet-500/20 to-purple-600/20",
    border: "border-violet-500/20 hover:border-violet-400/40",
    glow: "glow-purple",
    iconBg: "bg-violet-500/10",
  },
  {
    href: "/match",
    icon: "🃏",
    title: "Memory Match",
    description: "Flip cards and find matching pairs. Train your focus and sharpen your memory.",
    modes: ["4 pairs", "8 pairs", "12 pairs"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20 hover:border-blue-400/40",
    glow: "glow-blue",
    iconBg: "bg-blue-500/10",
  },
  {
    href: "/breathe",
    icon: "🌬️",
    title: "Just Breathe",
    description: "Guided breathing techniques used by therapists to calm your nervous system.",
    modes: ["Box", "4-7-8", "Calm"],
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20 hover:border-emerald-400/40",
    glow: "glow-green",
    iconBg: "bg-emerald-500/10",
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full">

      {/* NAV */}
      <nav className="px-6 sm:px-12 lg:px-20 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">U</div>
          <span className="font-semibold text-white/90 text-lg tracking-tight">Unwind</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/30 hidden sm:block">Stress relief puzzles</span>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative px-6 sm:px-12 lg:px-20 pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-emerald-600/6 rounded-full blur-3xl" />

        <div className="relative">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/50 border border-white/10 mb-6">
            Free to play · No ads · No account needed
          </div>
          <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-white mb-4">
            Puzzles designed<br />
            <span className="gradient-text">to calm your mind.</span>
          </h1>
          <p className="text-base sm:text-lg text-white/40 max-w-lg leading-relaxed">
            Three beautifully crafted games to help you decompress,
            refocus, and find your calm — anytime, anywhere.
          </p>
        </div>
      </div>

      {/* GAMES */}
      <div className="px-6 sm:px-12 lg:px-20 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 stagger">
          {GAMES.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className={`group relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 ${game.border} bg-gradient-to-br ${game.gradient} hover:scale-[1.02] fade-up`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${game.iconBg} flex items-center justify-center text-3xl mb-5`}>
                {game.icon}
              </div>

              {/* Content */}
              <h2 className="text-xl font-bold text-white mb-2 tracking-tight">{game.title}</h2>
              <p className="text-sm text-white/40 leading-relaxed mb-5">{game.description}</p>

              {/* Modes */}
              <div className="flex gap-2 flex-wrap mb-6">
                {game.modes.map(m => (
                  <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/5">
                    {m}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm font-medium text-white/50 group-hover:text-white/80 transition-colors">
                <span>Play now</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SOCIAL PROOF / STATS */}
      <div className="border-t border-white/5 px-6 sm:px-12 lg:px-20 py-12 sm:py-16">
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">3</div>
            <div className="text-xs sm:text-sm text-white/30 mt-1">Games</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">9</div>
            <div className="text-xs sm:text-sm text-white/30 mt-1">Difficulty modes</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">∞</div>
            <div className="text-xs sm:text-sm text-white/30 mt-1">Plays</div>
          </div>
        </div>
      </div>

      {/* QUOTE */}
      <div className="border-t border-white/5 px-6 sm:px-12 lg:px-20 py-10 sm:py-12">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm sm:text-base text-white/20 italic leading-relaxed">
            &ldquo;Almost everything will work again if you unplug it for a few minutes — including you.&rdquo;
          </p>
          <p className="text-xs text-white/15 mt-3">— Anne Lamott</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 sm:px-12 lg:px-20 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">U</div>
          <span className="text-sm font-medium text-white/40">Unwind</span>
        </div>
        <span className="text-xs text-white/20">Made with care</span>
      </footer>
    </main>
  );
}
