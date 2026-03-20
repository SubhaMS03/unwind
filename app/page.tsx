import Link from "next/link";

const GAMES = [
  {
    href: "/slide",
    emoji: "🧩",
    title: "Slide Puzzle",
    description: "Slide tiles to reveal a stunning landscape photo. Satisfying, meditative, beautiful.",
    modes: ["3×3 Easy", "4×4 Moderate", "5×5 Hard"],
    gradient: "from-emerald-400 to-teal-500",
    lightBg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    tag: "bg-emerald-100 text-emerald-700",
    glow: "hover:shadow-emerald-200",
  },
  {
    href: "/match",
    emoji: "🃏",
    title: "Memory Match",
    description: "Flip cards and find matching pairs. Calm your mind, focus your attention gently.",
    modes: ["4 pairs Easy", "8 pairs Moderate", "12 pairs Hard"],
    gradient: "from-blue-400 to-indigo-500",
    lightBg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    tag: "bg-blue-100 text-blue-700",
    glow: "hover:shadow-blue-200",
  },
  {
    href: "/breathe",
    emoji: "🫁",
    title: "Just Breathe",
    description: "Follow the expanding circle. Inhale. Hold. Exhale. The simplest stress relief.",
    modes: ["Box Breathing", "4-7-8 Technique", "Calm Breath"],
    gradient: "from-purple-400 to-pink-400",
    lightBg: "from-purple-50 to-pink-50",
    border: "border-purple-200",
    tag: "bg-purple-100 text-purple-700",
    glow: "hover:shadow-purple-200",
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', width: '100%' }} className="flex flex-col">

      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 pb-8 px-4">

        {/* Wordmark */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8 shadow-sm">
            <span className="text-green-500">🌿</span>
            <span className="text-sm font-medium text-gray-500 tracking-wide">stress relief · one moment at a time</span>
          </div>
          <h1 className="font-display text-6xl font-bold mb-4 leading-tight">
            <span className="gradient-text">Unwind</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-md mx-auto leading-relaxed font-light">
            Beautiful puzzles to calm your mind.<br />No pressure. Just peace.
          </p>
        </div>

        {/* Game cards */}
        <div className="w-full max-w-2xl space-y-4 px-2">
          {GAMES.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className={`block glass rounded-3xl p-6 shadow-lg hover:shadow-xl ${game.glow} transition-all duration-300 hover:-translate-y-0.5 border ${game.border} group`}
            >
              <div className="flex items-center gap-5">
                {/* Icon bubble */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center text-3xl shadow-md flex-shrink-0`}>
                  {game.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xl text-gray-800 group-hover:text-gray-900">{game.title}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">{game.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {game.modes.map(m => (
                      <span key={m} className={`text-xs px-2.5 py-1 rounded-full font-medium ${game.tag}`}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all text-xl flex-shrink-0">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 text-center max-w-sm px-4">
          <p className="text-gray-400 italic text-sm leading-relaxed">
            &ldquo;Almost everything will work again if you unplug it for a few minutes — including you.&rdquo;
          </p>
          <p className="text-gray-300 text-xs mt-2 font-medium tracking-wide">— Anne Lamott</p>
        </div>

      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <span className="text-xs text-gray-300 tracking-wider">UNWIND · MADE WITH CARE ✦</span>
      </footer>

    </div>
  );
}
