import Link from "next/link";

const GAMES = [
  {
    href: "/slide",
    emoji: "🧩",
    title: "Slide Puzzle",
    description: "Slide tiles to reveal a beautiful image. Satisfying and meditative.",
    modes: ["3×3 Easy", "4×4 Moderate", "5×5 Hard"],
    color: "hover:bg-emerald-50 hover:border-emerald-400",
  },
  {
    href: "/match",
    emoji: "🃏",
    title: "Memory Match",
    description: "Flip cards and find matching pairs. Calm your mind, focus your attention.",
    modes: ["4 pairs Easy", "8 pairs Moderate", "12 pairs Hard"],
    color: "hover:bg-blue-50 hover:border-blue-400",
  },
  {
    href: "/breathe",
    emoji: "🌬️",
    title: "Just Breathe",
    description: "Follow the circle. Inhale. Hold. Exhale. The simplest stress relief.",
    modes: ["4-7-8 Technique", "Box Breathing", "Deep Calm"],
    color: "hover:bg-purple-50 hover:border-purple-400",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col max-w-2xl mx-auto px-5">
      {/* NAV */}
      <nav className="py-6 flex items-center justify-between border-b border-gray-200">
        <div>
          <div className="text-2xl font-bold tracking-tight">Unwind</div>
          <div className="mono text-xs text-gray-400 mt-0.5">stress relief · one game at a time</div>
        </div>
        <div className="text-2xl">🌿</div>
      </nav>

      <div className="flex-1 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="text-5xl mb-5">🧘</div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Take a moment for yourself.</h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
            No scores. No timers unless you want them. Just beautiful puzzles to calm your mind.
          </p>
        </div>

        {/* Game cards */}
        <div className="space-y-4 mb-12">
          {GAMES.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className={`block border border-gray-200 p-6 rounded-2xl transition-all ${game.color} group`}
            >
              <div className="flex items-start gap-5">
                <div className="text-4xl">{game.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-xl mb-1 group-hover:text-gray-900">{game.title}</div>
                  <div className="text-gray-500 text-sm leading-relaxed mb-3">{game.description}</div>
                  <div className="flex gap-2 flex-wrap">
                    {game.modes.map(m => (
                      <span key={m} className="mono text-xs border border-gray-200 px-2 py-1 rounded-full text-gray-500">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-gray-300 group-hover:text-gray-600 text-2xl mt-1">→</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quote */}
        <div className="text-center py-8 border-t border-gray-100">
          <p className="text-gray-400 italic text-sm">&ldquo;Almost everything will work again if you unplug it for a few minutes.&rdquo;</p>
          <p className="mono text-xs text-gray-300 mt-2">— Anne Lamott</p>
        </div>
      </div>

      <footer className="border-t border-gray-100 py-5 text-center">
        <span className="mono text-xs text-gray-300">Unwind · Made with care</span>
      </footer>
    </main>
  );
}
