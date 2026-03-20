import Link from "next/link";

const GAMES = [
  {
    href: "/slide",
    emoji: "🧩",
    title: "SLIDE PUZZLE",
    description: "Rearrange tiles to reveal a landscape photo. Choose your scene and difficulty.",
    modes: ["3×3 Easy", "4×4 Moderate", "5×5 Hard"],
  },
  {
    href: "/match",
    emoji: "🃏",
    title: "MEMORY MATCH",
    description: "Flip cards and find all matching pairs. Test your focus and memory.",
    modes: ["4 pairs", "8 pairs", "12 pairs"],
  },
  {
    href: "/breathe",
    emoji: "🫁",
    title: "JUST BREATHE",
    description: "Guided breathing techniques to calm your nervous system instantly.",
    modes: ["Box", "4-7-8", "Calm"],
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full">

      {/* NAV */}
      <nav className="border-b-2 border-black py-5 px-6 sm:px-12 lg:px-24 flex items-center justify-between">
        <div>
          <div className="font-black text-2xl sm:text-3xl uppercase tracking-widest">[ UNWIND ]</div>
          <div className="text-xs opacity-50 mt-0.5">stress relief · one game at a time</div>
        </div>
        <div className="text-2xl">🌿</div>
      </nav>

      {/* HERO — full width black band */}
      <div className="bg-black text-white px-6 sm:px-12 lg:px-24 py-16 sm:py-24 lg:py-32">
        <h1 className="font-black text-4xl sm:text-6xl lg:text-8xl uppercase tracking-tight leading-[0.95]">
          Puzzles that<br />calm your mind.
        </h1>
        <p className="text-sm sm:text-base opacity-50 mt-4 sm:mt-6 max-w-lg leading-relaxed">
          No ads. No scores to chase. No pressure.<br />
          Just games designed to help you decompress.
        </p>
      </div>

      {/* GAMES GRID */}
      <div className="flex-1 px-6 sm:px-12 lg:px-24 py-10 sm:py-16">
        <div className="text-xs uppercase tracking-widest opacity-40 font-black mb-4">Choose a game</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-0">
          {GAMES.map((game, i) => (
            <Link
              key={game.href}
              href={game.href}
              className={`block border-2 border-black p-6 sm:p-8 hover:bg-black hover:text-white transition-colors group
                ${i > 0 ? '-mt-[2px] lg:mt-0 lg:-ml-[2px]' : ''}`}
              style={{ boxShadow: '4px 4px 0 #000' }}
            >
              <div className="text-4xl sm:text-5xl mb-4">{game.emoji}</div>
              <div className="font-black uppercase tracking-widest text-lg sm:text-xl mb-2">{game.title}</div>
              <div className="text-xs opacity-60 mb-4 leading-relaxed">{game.description}</div>
              <div className="flex gap-2 flex-wrap mb-4">
                {game.modes.map(m => (
                  <span key={m} className="text-xs border border-current px-2 py-0.5 opacity-50 group-hover:opacity-80">
                    {m}
                  </span>
                ))}
              </div>
              <div className="font-black uppercase tracking-widest text-sm opacity-30 group-hover:opacity-100 flex items-center gap-2">
                Play now →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* BOTTOM BAND */}
      <div className="border-t-2 border-black px-6 sm:px-12 lg:px-24 py-10 sm:py-14 bg-black text-white">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-xs opacity-40 italic max-w-md leading-relaxed">
              &ldquo;Almost everything will work again if you unplug it for a few minutes — including you.&rdquo;
            </p>
            <p className="text-xs opacity-30 mt-1">— Anne Lamott</p>
          </div>
          <div className="text-right">
            <div className="font-black text-xl uppercase tracking-widest">[ UNWIND ]</div>
            <div className="text-xs opacity-30 mt-1">Made with care</div>
          </div>
        </div>
      </div>

    </main>
  );
}
