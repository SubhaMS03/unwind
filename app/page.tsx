import Link from "next/link";

const GAMES = [
  {
    href: "/slide",
    icon: "🧩",
    title: "Slide Puzzle",
    description: "Rearrange tiles to reveal beautiful landscape photos. Choose your scene and difficulty.",
    modes: ["Easy", "Moderate", "Hard"],
    bg: "bg-[#E8E0F5]",
  },
  {
    href: "/match",
    icon: "🃏",
    title: "Memory Match",
    description: "Flip cards and find all matching pairs. Train your focus and sharpen your memory.",
    modes: ["4 pairs", "8 pairs", "12 pairs"],
    bg: "bg-[#D6EAF0]",
  },
  {
    href: "/breathe",
    icon: "🌬️",
    title: "Just Breathe",
    description: "Guided breathing techniques used by therapists to calm your nervous system.",
    modes: ["Box", "4-7-8", "Calm"],
    bg: "bg-[#D9EFE0]",
  },
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
      <nav className="w-full border-b border-[#E2DED9]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#7C5CBF] flex items-center justify-center text-white text-sm font-bold">U</div>
            <span className="font-semibold text-[#2D2C2B] text-lg">Unwind</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-[#7A7672]">
            <a href="#games" className="hover:text-[#2D2C2B] transition-colors">Games</a>
            <a href="#benefits" className="hover:text-[#2D2C2B] transition-colors">Benefits</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center">
          <p className="text-sm font-medium text-[#7C5CBF] mb-4">Free to play · No ads · No account needed</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-[#2D2C2B] mb-4">
            Puzzles designed to<br />calm your mind.
          </h1>
          <p className="text-base sm:text-lg text-[#7A7672] max-w-lg mx-auto leading-relaxed mb-8">
            Three beautifully crafted games to help you decompress, refocus, and find your calm — anytime, anywhere.
          </p>
          <Link
            href="/slide"
            className="inline-flex items-center gap-2 bg-[#7C5CBF] text-white font-semibold px-7 py-3 rounded-full text-sm hover:bg-[#6A4DAD] transition-colors shadow-sm"
          >
            Start playing
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* GAMES */}
      <section id="games" className="w-full">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2C2B] text-center mb-2">Choose your calm</h2>
          <p className="text-sm text-[#7A7672] text-center mb-10">Three different ways to unwind. Pick what feels right.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {GAMES.map((game) => (
              <Link
                key={game.href}
                href={game.href}
                className={`group rounded-2xl p-6 ${game.bg} transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="text-3xl mb-4">{game.icon}</div>
                <h3 className="text-lg font-bold text-[#2D2C2B] mb-1">{game.title}</h3>
                <p className="text-sm text-[#5A5856] leading-relaxed mb-4">{game.description}</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {game.modes.map(m => (
                    <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-white/60 text-[#5A5856]">
                      {m}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-[#7C5CBF] group-hover:underline flex items-center gap-1">
                  Play now
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2C2B] text-center mb-2">Why it works</h2>
          <p className="text-sm text-[#7A7672] text-center mb-10">Simple activities with real impact on your wellbeing.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl p-6 bg-[#FAF8F5] text-center">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="text-base font-bold text-[#2D2C2B] mb-1">{b.title}</h3>
                <p className="text-sm text-[#7A7672] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="w-full border-y border-[#E2DED9]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#2D2C2B]">3</div>
              <div className="text-sm text-[#7A7672] mt-1">Games</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2D2C2B]">9</div>
              <div className="text-sm text-[#7A7672] mt-1">Difficulty modes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2D2C2B]">∞</div>
              <div className="text-sm text-[#7A7672] mt-1">Unlimited plays</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[#7C5CBF]">
        <div className="max-w-5xl mx-auto px-6 py-14 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to unwind?</h2>
          <p className="text-sm text-white/70 mb-8 max-w-md mx-auto">No sign-up. No payment. Just pick a game and breathe.</p>
          <Link
            href="/slide"
            className="inline-flex items-center gap-2 bg-white text-[#7C5CBF] font-semibold px-7 py-3 rounded-full text-sm hover:bg-white/90 transition-colors"
          >
            Start now — it&apos;s free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* QUOTE */}
      <section className="w-full">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <p className="text-sm text-[#9A9691] italic leading-relaxed max-w-lg mx-auto">
            &ldquo;Almost everything will work again if you unplug it for a few minutes — including you.&rdquo;
          </p>
          <p className="text-xs text-[#B5B1AD] mt-2">— Anne Lamott</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#E2DED9]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#7C5CBF] flex items-center justify-center text-white text-[10px] font-bold">U</div>
            <span className="text-sm text-[#7A7672]">Unwind</span>
          </div>
          <span className="text-xs text-[#B5B1AD]">Made with care</span>
        </div>
      </footer>
    </main>
  );
}
