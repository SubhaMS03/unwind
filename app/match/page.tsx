'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const CARD_SETS = {
  easy: ['🌸', '🌊', '🌿', '🦋'],
  moderate: ['🌸', '🌊', '🌿', '🦋', '🌙', '☀️', '🍃', '🌺'],
  hard: ['🌸', '🌊', '🌿', '🦋', '🌙', '☀️', '🍃', '🌺', '🦚', '🌴', '🌸', '❄️'],
};

type Difficulty = 'easy' | 'moderate' | 'hard';

interface Card { id: number; emoji: string; flipped: boolean; matched: boolean; }

function createCards(emojis: string[]): Card[] {
  const doubled = [...emojis, ...emojis];
  const shuffled = doubled.sort(() => Math.random() - 0.5);
  return shuffled.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

const GRID: Record<Difficulty, string> = { easy: 'grid-cols-4', moderate: 'grid-cols-4', hard: 'grid-cols-6' };
const DIFF_META: Record<Difficulty, string> = { easy: '4 pairs · 8 cards', moderate: '8 pairs · 16 cards', hard: '12 pairs · 24 cards' };

export default function MatchPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => { if (!running) return; const t = setInterval(() => setSeconds(s => s + 1), 1000); return () => clearInterval(t); }, [running]);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff); setCards(createCards(CARD_SETS[diff])); setFlipped([]); setMoves(0); setSeconds(0); setRunning(true); setSolved(false); setLocked(false);
  };

  const handleCardClick = useCallback((id: number) => {
    if (locked || solved) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    const newFlipped = [...flipped, id];
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards); setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1); setLocked(true);
      const [a, b] = newFlipped.map(fid => newCards.find(c => c.id === fid)!);
      if (a.emoji === b.emoji) {
        setTimeout(() => { const matched = newCards.map(c => c.id === a.id || c.id === b.id ? { ...c, matched: true } : c); setCards(matched); setFlipped([]); setLocked(false); if (matched.every(c => c.matched)) { setSolved(true); setRunning(false); } }, 400);
      } else {
        setTimeout(() => { setCards(newCards.map(c => c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c)); setFlipped([]); setLocked(false); }, 900);
      }
    }
  }, [cards, flipped, locked, solved]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const matchedCount = cards.filter(c => c.matched).length / 2;
  const totalPairs = cards.length / 2;

  if (!difficulty) {
    return (
      <main className="flex-1 flex flex-col w-full relative overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#5B8DB8]/15 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#7C5CBF]/10 blur-[100px]" />
        </div>
        <nav className="sticky top-0 z-50 bg-[#0F0B15]/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-white/40 hover:text-white transition-colors">← Back</Link>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-sm font-semibold text-white">Memory Match</span>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center py-16 relative z-10">
          <div className="max-w-md w-full px-6">
            <div className="text-center mb-10">
              <div className="text-5xl mb-5">🧠</div>
              <h1 className="text-3xl font-bold text-white mb-2">Memory Match</h1>
              <p className="text-sm text-white/40">Flip cards and find all matching pairs.</p>
            </div>
            <div className="space-y-3">
              {(['easy', 'moderate', 'hard'] as Difficulty[]).map((d) => (
                <button key={d} onClick={() => startGame(d)} className="w-full rounded-2xl p-5 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-left flex items-center justify-between group transition-all duration-200">
                  <div>
                    <div className="font-semibold text-white capitalize">{d}</div>
                    <div className="text-xs text-white/35 mt-0.5">{DIFF_META[d]}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{CARD_SETS[d].slice(0, 3).join('')}</span>
                    <svg className="w-5 h-5 text-white/20 group-hover:text-[#82C9E5] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col w-full relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#5B8DB8]/12 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] rounded-full bg-[#D4845A]/8 blur-[100px]" />
      </div>
      <nav className="sticky top-0 z-50 bg-[#0F0B15]/70 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setDifficulty(null); setRunning(false); }} className="text-sm font-medium text-white/40 hover:text-white transition-colors">← Change</button>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-sm font-semibold text-white capitalize">🧠 {difficulty}</span>
          </div>
          <button onClick={() => startGame(difficulty)} className="text-xs font-medium text-white/40 hover:text-white px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] transition-all">↺ Restart</button>
        </div>
      </nav>

      <div className="border-b border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
          <div><span className="text-lg font-bold text-white">{matchedCount}/{totalPairs}</span><span className="text-xs text-white/35 ml-1">pairs</span></div>
          <div className="w-px h-5 bg-white/10" />
          <div><span className="text-lg font-bold text-white">{moves}</span><span className="text-xs text-white/35 ml-1">moves</span></div>
          <div className="w-px h-5 bg-white/10" />
          <div><span className="text-lg font-bold text-white">{fmt(seconds)}</span><span className="text-xs text-white/35 ml-1">time</span></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-6 relative z-10">
        <div className={`grid ${GRID[difficulty]} gap-2.5 sm:gap-3 w-full max-w-md px-6`}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square text-2xl sm:text-3xl flex items-center justify-center transition-all duration-200 rounded-xl
                ${card.matched ? 'bg-[#7C5CBF]/20 border border-[#7C5CBF]/30 match-pop' : card.flipped ? 'bg-white/[0.1] border border-white/[0.2] flip-in shadow-lg' : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] cursor-pointer'}`}
            >
              {card.flipped || card.matched ? card.emoji : ''}
            </button>
          ))}
        </div>
      </div>

      {solved && (
        <div className="fade-up pb-8 relative z-10">
          <div className="max-w-sm mx-auto rounded-2xl p-8 text-center bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
            <div className="text-4xl mb-2">✨</div>
            <h2 className="text-xl font-bold text-white mb-1">All Pairs Found!</h2>
            <p className="text-sm text-white/40 mb-6">{moves} moves · {fmt(seconds)}</p>
            <div className="flex gap-3">
              <button onClick={() => startGame(difficulty)} className="flex-1 bg-[#7C5CBF] text-white font-semibold py-3 rounded-full text-sm hover:bg-[#6A4DAD] transition-colors">Play Again</button>
              <button onClick={() => setDifficulty(null)} className="flex-1 bg-white/[0.06] text-white font-semibold py-3 rounded-full text-sm hover:bg-white/[0.1] border border-white/[0.06] transition-colors">Change Mode</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
