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
      <div className="min-h-screen w-full flex flex-col items-center">
        <div className="w-full max-w-lg px-6">
          <nav className="py-5 flex items-center gap-3 border-b border-gray-100">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-800 transition-colors">← Back</Link>
            <span className="text-gray-200">|</span>
            <span className="font-semibold text-sm">🃏 Memory Match</span>
          </nav>
          <div className="pt-10 pb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Memory Match</h1>
            <p className="text-gray-400 text-sm">Flip cards to find all matching pairs.</p>
          </div>
          <div className="space-y-2 pb-10">
            {(['easy', 'moderate', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => startGame(d)}
                className="w-full border border-gray-100 rounded-xl p-4 text-left hover:border-gray-300 hover:bg-gray-50 transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold capitalize">{d}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{CARD_SETS[d].length} pairs · {CARD_SETS[d].length * 2} cards</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{CARD_SETS[d].slice(0, 3).join(' ')}</span>
                  <span className="text-gray-300 group-hover:text-gray-600 transition-colors">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-lg px-6">
        <nav className="py-5 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => { setDifficulty(null); setRunning(false); }} className="text-sm text-gray-400 hover:text-gray-800 transition-colors">← Change</button>
            <span className="text-gray-200">|</span>
            <span className="font-semibold text-sm capitalize">🃏 {difficulty}</span>
          </div>
          <button onClick={() => startGame(difficulty)} className="text-xs border border-gray-200 px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors">↺ Restart</button>
        </nav>

        {/* Stats */}
        <div className="flex items-center justify-between py-5 border-b border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold">{matchedCount}/{totalPairs}</div>
            <div className="text-xs text-gray-400 mt-0.5">pairs found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{moves}</div>
            <div className="text-xs text-gray-400 mt-0.5">moves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{fmt(seconds)}</div>
            <div className="text-xs text-gray-400 mt-0.5">time</div>
          </div>
        </div>

        {/* Cards */}
        <div className={`grid ${GRID[difficulty]} gap-2.5 py-6`}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all border
                ${card.matched
                  ? 'bg-gray-900 border-gray-900 text-white match-pop'
                  : card.flipped
                  ? 'bg-gray-100 border-gray-200 flip-in'
                  : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                }`}
            >
              {card.flipped || card.matched ? card.emoji : ''}
            </button>
          ))}
        </div>

        {solved && (
          <div className="fade-in border border-gray-200 rounded-2xl p-6 mb-6 text-center">
            <div className="text-4xl mb-3">✨</div>
            <div className="font-extrabold text-xl mb-1">All Pairs Found!</div>
            <div className="text-sm text-gray-400 mb-5">{moves} moves · {fmt(seconds)}</div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => startGame(difficulty)} className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                Play Again
              </button>
              <button onClick={() => setDifficulty(null)} className="border border-gray-200 px-6 py-2.5 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Change Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
