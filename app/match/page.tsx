'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const CARD_SETS = {
  easy: ['🌸', '🌊', '🌿', '🦋'],
  moderate: ['🌸', '🌊', '🌿', '🦋', '🌙', '☀️', '🍃', '🌺'],
  hard: ['🌸', '🌊', '🌿', '🦋', '🌙', '☀️', '🍃', '🌺', '🦚', '🌴', '🌸', '❄️'],
};

type Difficulty = 'easy' | 'moderate' | 'hard';

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function createCards(emojis: string[]): Card[] {
  const doubled = [...emojis, ...emojis];
  const shuffled = doubled.sort(() => Math.random() - 0.5);
  return shuffled.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

const GRID: Record<Difficulty, string> = {
  easy: 'grid-cols-4',
  moderate: 'grid-cols-4',
  hard: 'grid-cols-6',
};

export default function MatchPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setCards(createCards(CARD_SETS[diff]));
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setRunning(true);
    setSolved(false);
    setLocked(false);
  };

  const handleCardClick = useCallback((id: number) => {
    if (locked || solved) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flipped, id];
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped.map(fid => newCards.find(c => c.id === fid)!);
      if (a.emoji === b.emoji) {
        setTimeout(() => {
          const matched = newCards.map(c =>
            c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
          );
          setCards(matched);
          setFlipped([]);
          setLocked(false);
          if (matched.every(c => c.matched)) {
            setSolved(true);
            setRunning(false);
          }
        }, 400);
      } else {
        setTimeout(() => {
          setCards(newCards.map(c =>
            c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [cards, flipped, locked, solved]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const matchedCount = cards.filter(c => c.matched).length / 2;
  const totalPairs = cards.length / 2;

  if (!difficulty) {
    return (
      <main className="min-h-screen flex flex-col max-w-2xl mx-auto px-4">
        <nav className="border-b-2 border-black py-4 flex items-center gap-3">
          <Link href="/" className="text-sm opacity-60 hover:opacity-100 transition-opacity">← Back</Link>
          <span className="opacity-20">|</span>
          <span className="font-black uppercase tracking-widest text-sm">🃏 Memory Match</span>
        </nav>

        <div className="flex-1 py-8">
          <div className="border-2 border-black mb-6">
            <div className="bg-black text-white px-5 py-2">
              <span className="font-black uppercase tracking-widest text-xs">Choose Difficulty</span>
            </div>
            <div className="p-5">
              <p className="text-sm opacity-60 mb-0">Flip cards to find all matching pairs.</p>
            </div>
          </div>

          <div className="space-y-0">
            {(['easy', 'moderate', 'hard'] as Difficulty[]).map((d, i) => (
              <button
                key={d}
                onClick={() => startGame(d)}
                className={`w-full border-2 border-black p-4 text-left hover:bg-black hover:text-white transition-colors group flex items-center justify-between ${i > 0 ? '-mt-[2px]' : ''}`}
              >
                <div>
                  <div className="font-black uppercase tracking-widest">{d}</div>
                  <div className="text-xs opacity-50 mt-0.5">{CARD_SETS[d].length} pairs · {CARD_SETS[d].length * 2} cards</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{CARD_SETS[d].slice(0, 3).join(' ')}</span>
                  <span className="font-black opacity-30 group-hover:opacity-100">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col max-w-2xl mx-auto px-4">
      <nav className="border-b-2 border-black py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => { setDifficulty(null); setRunning(false); }} className="text-sm opacity-60 hover:opacity-100 transition-opacity">← Change</button>
          <span className="opacity-20">|</span>
          <span className="font-black uppercase tracking-widest text-sm capitalize">🃏 {difficulty}</span>
        </div>
        <button onClick={() => startGame(difficulty)} className="border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">↺ Restart</button>
      </nav>

      {/* Stats */}
      <div className="border-b-2 border-black flex">
        <div className="flex-1 border-r-2 border-black p-4 text-center">
          <div className="font-black text-2xl">{matchedCount}/{totalPairs}</div>
          <div className="text-xs uppercase tracking-widest opacity-50">Pairs</div>
        </div>
        <div className="flex-1 border-r-2 border-black p-4 text-center">
          <div className="font-black text-2xl">{moves}</div>
          <div className="text-xs uppercase tracking-widest opacity-50">Moves</div>
        </div>
        <div className="flex-1 p-4 text-center">
          <div className="font-black text-2xl">{fmt(seconds)}</div>
          <div className="text-xs uppercase tracking-widest opacity-50">Time</div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 py-6 px-2">
        <div className={`grid ${GRID[difficulty]} gap-2`}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square text-2xl flex items-center justify-center transition-all border-2
                ${card.matched
                  ? 'bg-black border-black text-white match-pop'
                  : card.flipped
                  ? 'bg-white border-black flip-in'
                  : 'bg-white border-black opacity-30 hover:opacity-60 cursor-pointer'
                }`}
            >
              {card.flipped || card.matched ? card.emoji : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Solved */}
      {solved && (
        <div className="fade-in border-t-2 border-black">
          <div className="bg-black text-white px-6 py-3 text-center">
            <div className="text-3xl mb-1">✨</div>
            <div className="font-black text-xl uppercase tracking-widest">All Pairs Found!</div>
            <div className="text-xs opacity-60 mt-1">{moves} moves · {fmt(seconds)}</div>
          </div>
          <div className="p-5 flex gap-3">
            <button onClick={() => startGame(difficulty)} className="flex-1 bg-black text-white border-2 border-black py-3 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors">
              Play Again
            </button>
            <button onClick={() => setDifficulty(null)} className="flex-1 border-2 border-black py-3 font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
              Change Mode
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
