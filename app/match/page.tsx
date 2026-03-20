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
      <main className="min-h-screen flex flex-col max-w-xl mx-auto px-5">
        <nav className="py-5 flex items-center gap-3 border-b border-gray-200">
          <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm">← Back</Link>
          <span className="text-gray-200">|</span>
          <span className="font-bold">🃏 Memory Match</span>
        </nav>
        <div className="flex-1 py-10">
          <h1 className="text-3xl font-bold mb-2">Memory Match</h1>
          <p className="text-gray-400 text-sm mb-8">Flip cards to find matching pairs. Clear your mind.</p>
          <div className="space-y-3">
            {(['easy', 'moderate', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => startGame(d)}
                className="w-full border border-gray-200 rounded-2xl p-5 text-left hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg capitalize group-hover:text-blue-700">{d}</div>
                    <div className="mono text-xs text-gray-400 mt-1">
                      {CARD_SETS[d].length} pairs · {CARD_SETS[d].length * 2} cards
                    </div>
                  </div>
                  <div className="text-2xl">
                    {CARD_SETS[d].slice(0, 3).join(' ')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col max-w-xl mx-auto px-5">
      <nav className="py-5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button onClick={() => { setDifficulty(null); setRunning(false); }} className="text-gray-400 hover:text-gray-700 text-sm">← Change</button>
          <span className="text-gray-200">|</span>
          <span className="font-bold text-sm capitalize">🃏 {difficulty}</span>
        </div>
        <button onClick={() => startGame(difficulty)} className="mono text-xs border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50">
          Restart
        </button>
      </nav>

      <div className="flex-1 py-6">
        {/* Stats */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-center">
            <div className="mono text-2xl font-bold">{matchedCount}/{totalPairs}</div>
            <div className="mono text-xs text-gray-400">pairs found</div>
          </div>
          <div className="text-center">
            <div className="mono text-2xl font-bold">{moves}</div>
            <div className="mono text-xs text-gray-400">moves</div>
          </div>
          <div className="text-center">
            <div className="mono text-2xl font-bold">{fmt(seconds)}</div>
            <div className="mono text-xs text-gray-400">time</div>
          </div>
        </div>

        {/* Cards */}
        <div className={`grid ${GRID[difficulty]} gap-3 mb-6`}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all border-2
                ${card.matched
                  ? 'bg-emerald-50 border-emerald-200 match-pop'
                  : card.flipped
                  ? 'bg-blue-50 border-blue-200 flip-in'
                  : 'bg-gray-100 border-gray-200 hover:bg-gray-200 cursor-pointer'
                }`}
            >
              {card.flipped || card.matched ? card.emoji : ''}
            </button>
          ))}
        </div>

        {solved && (
          <div className="text-center fade-in border border-emerald-200 bg-emerald-50 rounded-2xl p-6">
            <div className="text-4xl mb-3">✨</div>
            <div className="font-bold text-xl text-emerald-700 mb-1">All Pairs Found!</div>
            <div className="mono text-sm text-gray-500 mb-4">{moves} moves · {fmt(seconds)}</div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => startGame(difficulty)} className="border border-emerald-300 text-emerald-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-emerald-100">
                Play Again
              </button>
              <button onClick={() => setDifficulty(null)} className="border border-gray-200 px-5 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-50">
                Change Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
