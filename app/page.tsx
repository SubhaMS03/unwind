import Link from "next/link";

const GAMES = [
  {
    href: "/slide",
    emoji: "🧩",
    title: "Slide Puzzle",
    description: "Rearrange tiles to reveal a beautiful landscape photo.",
    modes: ["3×3 Easy", "4×4 Moderate", "5×5 Hard"],
  },
  {
    href: "/match",
    emoji: "🃏",
    title: "Memory Match",
    description: "Flip cards and find matching pairs. Train your focus.",
    modes: ["4 pairs", "8 pairs", "12 pairs"],
  },
  {
    href: "/breathe",
    emoji: "🫁",
    title: "Just Breathe",
    description: "Guided breathing exercises to calm your nervous system.",
    modes: ["Box", "4-7-8", "Calm"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start">

      {/* Header */}
      <header className="w-full border-b border-gray-100 px-6 py-5 flex items-center justify-between max-w-2xl mx-auto">
        <div>
          <div className="text-2xl font-bold tracking-tight">Unwind</div>
          <div className="text-xs text-gray-400 mt-0.5 tracking-wide">stress relief · puzzles</div>
        </div>
        <span className="text-2xl">🌿</span>
      </header>

      {/* Hero */}
      <div className="w-full max-w-2xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="text-5xl mb-6">🧘</div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 leading-tight">
          Take a moment<br />for yourself.
        </h1>
        <p className="text-gray-400 text-base max-w-sm mx-auto leading-relaxed">
          No scores. No pressure. Just calm games to clear your head.
        </p>
      </div>

      {/* Game list */}
      <div className="w-full max-w-2xl mx-auto px-6 pb-16 space-y-3">
        {GAMES.map((game, i) => (
          <Link
            key={game.href}
            href={game.href}
            className="flex items-center gap-5 p-5 border border-gray-100 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors flex items-center justify-center text-2xl flex-shrink-0">
              {game.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 mb-0.5">{game.title}</div>
              <div className="text-sm text-gray-400 mb-2">{game.description}</div>
              <div className="flex gap-1.5 flex-wrap">
                {game.modes.map(m => (
                  <span key={m} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-gray-300 group-hover:text-gray-600 transition-colors text-lg flex-shrink-0">→</div>
          </Link>
        ))}
      </div>

      {/* Quote */}
      <div className="w-full max-w-2xl mx-auto px-6 pb-16 text-center">
        <div className="border-t border-gray-100 pt-10">
          <p className="text-gray-300 text-sm italic">
            &ldquo;Almost everything will work again if you unplug it for a few minutes — including you.&rdquo;
          </p>
          <p className="text-gray-200 text-xs mt-2">— Anne Lamott</p>
        </div>
      </div>

    </div>
  );
}
