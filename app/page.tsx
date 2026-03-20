import Link from "next/link";

const GAMES = [
  {
    href: "/slide",
    emoji: "🧩",
    title: "SLIDE PUZZLE",
    description: "Rearrange tiles to reveal a landscape photo.",
    modes: ["3×3 Easy", "4×4 Moderate", "5×5 Hard"],
  },
  {
    href: "/match",
    emoji: "🃏",
    title: "MEMORY MATCH",
    description: "Flip cards and find all matching pairs.",
    modes: ["4 pairs", "8 pairs", "12 pairs"],
  },
  {
    href: "/breathe",
    emoji: "🫁",
    title: "JUST BREATHE",
    description: "Guided breathing to calm your nervous system.",
    modes: ["Box", "4-7-8", "Calm"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col max-w-2xl mx-auto px-4">

      {/* NAV */}
      <nav className="border-b-2 border-black py-4 flex items-center justify-between">
        <div>
          <div className="font-black text-xl uppercase tracking-widest">[ UNWIND ]</div>
          <div className="text-xs opacity-50">stress relief · one game at a time</div>
        </div>
        <div className="text-2xl">🌿</div>
      </nav>

      <div className="flex-1 py-10">

        {/* Hero */}
        <div className="border-2 border-black mb-8">
          <div className="bg-black text-white px-6 py-3">
            <span className="font-black uppercase tracking-widest text-sm">Take a moment</span>
          </div>
          <div className="p-6">
            <h1 className="font-black text-4xl uppercase tracking-tight leading-tight mb-3">
              Puzzles that<br />calm your mind.
            </h1>
            <p className="text-sm opacity-60">
              No ads. No timers unless you want them.<br />
              Just games to decompress.
            </p>
          </div>
        </div>

        {/* Games */}
        <div className="space-y-0">
          {GAMES.map((game, i) => (
            <Link
              key={game.href}
              href={game.href}
              className={`block border-2 border-black p-5 hover:bg-black hover:text-white transition-colors group ${i > 0 ? '-mt-[2px]' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{game.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-black uppercase tracking-widest text-base">{game.title}</div>
                  <div className="text-xs opacity-60 mt-0.5 mb-2">{game.description}</div>
                  <div className="flex gap-2 flex-wrap">
                    {game.modes.map(m => (
                      <span key={m} className="text-xs border border-current px-2 py-0.5 opacity-50 group-hover:opacity-80">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="opacity-30 group-hover:opacity-100 text-xl font-black mt-1">→</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quote */}
        <div className="border-t-2 border-black mt-10 pt-6">
          <p className="text-xs opacity-40 italic">
            &ldquo;Almost everything will work again if you unplug it for a few minutes — including you.&rdquo;
          </p>
          <p className="text-xs opacity-30 mt-1">— Anne Lamott</p>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="border-t-2 border-black py-5 flex items-center justify-between">
        <span className="font-black uppercase tracking-widest text-sm">[ UNWIND ]</span>
        <span className="text-xs opacity-40">Made with care</span>
      </footer>

    </main>
  );
}
