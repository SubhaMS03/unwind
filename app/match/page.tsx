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
      <div style={{ minHeight: '100vh', width: '100%' }} className="flex flex-col">
        <div className="flex-1 flex flex-col items-center px-4 pt-8 pb-8">
          <div className="w-full max-w-lg">
            <nav className="flex items-center gap-3 mb-8">
              <Link href="/" className="glass rounded-full px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors shadow-sm">← Back</Link>
              <span className="font-semibold text-gray-700">🃏 Memory Match</span>
            </nav>
            <h1 className="font-display text-4xl font-bold mb-2 text-gray-800">Memory Match</h1>
            <p className="text-gray-400 text-sm mb-8">Flip cards to find matching pairs. Focus your mind.</p>
            <div className="space-y-3">
              {(['easy', 'moderate', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => startGame(d)}
                  className="w-full glass rounded-2xl p-5 text-left hover:shadow-md hover:shadow-blue-100 transition-all group border border-white/80 hover:border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg capitalize text-gray-700 group-hover:text-blue-700">{d}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {CARD_SETS[d].length} pairs · {CARD_SETS[d].length * 2} cards
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{CARD_SETS[d].slice(0, 3).join(' ')}</span>
                      <span className="text-gray-300 group-hover:text-blue-400 text-xl">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%' }} className="flex flex-col">
      <div className="flex-1 flex flex-col items-center px-4 pt-6 pb-8">
        <div className="w-full max-w-lg">
          <nav className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => { setDifficulty(null); setRunning(false); }} className="glass rounded-full px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors shadow-sm">← Change</button>
              <span className="font-semibold text-gray-700 text-sm capitalize">🃏 {difficulty}</span>
            </div>
            <button onClick={() => startGame(difficulty)} className="glass text-xs px-4 py-2 rounded-full text-gray-500 hover:text-gray-800 shadow-sm transition-colors">
              ↺ Restart
            </button>
          </nav>

          {/* Stats */}
          <div className="glass rounded-2xl p-4 flex items-center justify-around mb-5 shadow-sm border border-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{matchedCount}/{totalPairs}</div>
              <div className="text-xs text-gray-400 mt-0.5">pairs found</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{moves}</div>
              <div className="text-xs text-gray-400 mt-0.5">moves</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{fmt(seconds)}</div>
              <div className="text-xs text-gray-400 mt-0.5">time</div>
            </div>
          </div>

          {/* Cards */}
          <div className={`grid ${GRID[difficulty]} gap-3 mb-6`}>
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all shadow-sm
                  ${card.matched
                    ? 'bg-emerald-100 border-2 border-emerald-300 match-pop shadow-emerald-100'
                    : card.flipped
                    ? 'bg-blue-100 border-2 border-blue-300 flip-in shadow-blue-100'
                    : 'glass border border-white/80 hover:shadow-md cursor-pointer'
                  }`}
              >
                {card.flipped || card.matched ? card.emoji : ''}
              </button>
            ))}
          </div>

          {solved && (
            <div className="text-center fade-in glass rounded-3xl p-6 shadow-lg border border-emerald-200">
              <div className="text-4xl mb-3 float">✨</div>
              <div className="font-display font-bold text-2xl text-emerald-700 mb-1">All Pairs Found!</div>
              <div className="text-sm text-gray-400 mb-5">{moves} moves · {fmt(seconds)}</div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => startGame(difficulty)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-md">
                  Play Again
                </button>
                <button onClick={() => setDifficulty(null)} className="glass px-6 py-2.5 rounded-full text-sm text-gray-600 hover:text-gray-800 transition-colors shadow-sm">
                  Change Mode
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
