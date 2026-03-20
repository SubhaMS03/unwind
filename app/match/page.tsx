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
      <main className="flex-1 flex flex-col w-full bg-white">
        <nav className="border-b border-[#E2DED9]">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
            <Link href="/" className="text-sm text-[#7A7672] hover:text-[#2D2C2B] transition-colors">← Back</Link>
            <div className="w-px h-4 bg-[#E2DED9]" />
            <span className="text-sm font-semibold text-[#2D2C2B]">🃏 Memory Match</span>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <div className="max-w-md w-full px-6">
            <h1 className="text-2xl font-bold text-[#2D2C2B] text-center mb-2">Memory Match</h1>
            <p className="text-sm text-[#7A7672] text-center mb-8">Flip cards and find all matching pairs.</p>
            <div className="space-y-2">
              {(['easy', 'moderate', 'hard'] as Difficulty[]).map((d) => (
                <button key={d} onClick={() => startGame(d)} className="w-full rounded-xl p-4 bg-[#FAF8F5] hover:bg-[#F0ECE7] text-left flex items-center justify-between group transition-colors">
                  <div>
                    <div className="font-semibold text-[#2D2C2B] capitalize">{d}</div>
                    <div className="text-xs text-[#7A7672] mt-0.5">{DIFF_META[d]}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{CARD_SETS[d].slice(0, 3).join('')}</span>
                    <svg className="w-5 h-5 text-[#B5B1AD] group-hover:text-[#7C5CBF] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
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
    <main className="flex-1 flex flex-col w-full bg-white">
      <nav className="border-b border-[#E2DED9]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setDifficulty(null); setRunning(false); }} className="text-sm text-[#7A7672] hover:text-[#2D2C2B] transition-colors">← Change</button>
            <div className="w-px h-4 bg-[#E2DED9]" />
            <span className="text-sm font-semibold text-[#2D2C2B] capitalize">🃏 {difficulty}</span>
          </div>
          <button onClick={() => startGame(difficulty)} className="text-xs text-[#7A7672] hover:text-[#2D2C2B] px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F0ECE7] transition-colors">↺ Restart</button>
        </div>
      </nav>

      <div className="border-b border-[#E2DED9]">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
          <div><span className="text-lg font-bold text-[#2D2C2B]">{matchedCount}/{totalPairs}</span><span className="text-xs text-[#7A7672] ml-1">pairs</span></div>
          <div className="w-px h-5 bg-[#E2DED9]" />
          <div><span className="text-lg font-bold text-[#2D2C2B]">{moves}</span><span className="text-xs text-[#7A7672] ml-1">moves</span></div>
          <div className="w-px h-5 bg-[#E2DED9]" />
          <div><span className="text-lg font-bold text-[#2D2C2B]">{fmt(seconds)}</span><span className="text-xs text-[#7A7672] ml-1">time</span></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-6">
        <div className={`grid ${GRID[difficulty]} gap-2.5 sm:gap-3 w-full max-w-md px-6`}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square text-2xl sm:text-3xl flex items-center justify-center transition-all duration-200 rounded-xl
                ${card.matched ? 'bg-[#E8E0F5] match-pop' : card.flipped ? 'bg-white shadow-md border border-[#E2DED9] flip-in' : 'bg-[#FAF8F5] hover:bg-[#F0ECE7] border border-[#E2DED9] cursor-pointer'}`}
            >
              {card.flipped || card.matched ? card.emoji : ''}
            </button>
          ))}
        </div>
      </div>

      {solved && (
        <div className="fade-up pb-8">
          <div className="max-w-sm mx-auto bg-[#D6EAF0] rounded-2xl p-8 text-center">
            <div className="text-4xl mb-2">✨</div>
            <h2 className="text-xl font-bold text-[#2D2C2B] mb-1">All Pairs Found!</h2>
            <p className="text-sm text-[#5A5856] mb-6">{moves} moves · {fmt(seconds)}</p>
            <div className="flex gap-3">
              <button onClick={() => startGame(difficulty)} className="flex-1 bg-[#7C5CBF] text-white font-semibold py-3 rounded-full text-sm hover:bg-[#6A4DAD] transition-colors">Play Again</button>
              <button onClick={() => setDifficulty(null)} className="flex-1 bg-white text-[#2D2C2B] font-semibold py-3 rounded-full text-sm hover:bg-[#F0ECE7] transition-colors">Change Mode</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
