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

const DIFF_META: Record<Difficulty, { pairs: number; desc: string }> = {
  easy: { pairs: 4, desc: '4 pairs · 8 cards' },
  moderate: { pairs: 8, desc: '8 pairs · 16 cards' },
  hard: { pairs: 12, desc: '12 pairs · 24 cards' },
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

  // Selection screen
  if (!difficulty) {
    return (
      <main className="flex-1 flex flex-col w-full px-6 sm:px-12 lg:px-20">
        <nav className="py-5 flex items-center gap-4 border-b border-white/5">
          <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-sm font-medium text-white/70">🃏 Memory Match</span>
        </nav>

        <div className="flex-1 flex flex-col justify-center py-8 max-w-lg mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Memory Match</h1>
            <p className="text-sm text-white/40">Flip cards to find all matching pairs. Test your focus.</p>
          </div>

          <div className="space-y-3">
            {(['easy', 'moderate', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => startGame(d)}
                className="w-full glass glass-hover rounded-xl p-5 text-left flex items-center justify-between group transition-all duration-200"
              >
                <div>
                  <div className="font-semibold text-white/90 capitalize text-base">{d}</div>
                  <div className="text-xs text-white/30 mt-0.5">{DIFF_META[d].desc}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{CARD_SETS[d].slice(0, 3).join('')}</span>
                  <svg className="w-5 h-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Game screen
  return (
    <main className="flex-1 flex flex-col w-full px-6 sm:px-12 lg:px-20">
      <nav className="py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => { setDifficulty(null); setRunning(false); }} className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Change
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-sm font-medium text-white/70 capitalize">🃏 {difficulty}</span>
        </div>
        <button onClick={() => startGame(difficulty)} className="btn-secondary text-xs px-3 py-1.5">↺ Restart</button>
      </nav>

      {/* Stats */}
      <div className="flex items-center gap-6 py-4 border-b border-white/5">
        <div className="text-center">
          <div className="text-xl font-bold text-white">{matchedCount}/{totalPairs}</div>
          <div className="text-xs text-white/30">Pairs</div>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <div className="text-xl font-bold text-white">{moves}</div>
          <div className="text-xs text-white/30">Moves</div>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <div className="text-xl font-bold text-white">{fmt(seconds)}</div>
          <div className="text-xs text-white/30">Time</div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 flex items-center justify-center py-6">
        <div className={`grid ${GRID[difficulty]} gap-2 sm:gap-3 w-full max-w-md`}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square text-2xl sm:text-3xl flex items-center justify-center transition-all duration-200 rounded-xl border
                ${card.matched
                  ? 'bg-violet-500/20 border-violet-500/30 match-pop'
                  : card.flipped
                  ? 'bg-white/10 border-white/20 flip-in'
                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 cursor-pointer'
                }`}
            >
              {card.flipped || card.matched ? card.emoji : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Solved */}
      {solved && (
        <div className="fade-up pb-8">
          <div className="glass rounded-2xl p-8 text-center max-w-sm mx-auto glow-blue">
            <div className="text-4xl mb-3">✨</div>
            <div className="text-xl font-bold text-white mb-1">All Pairs Found!</div>
            <div className="text-sm text-white/40 mb-6">{moves} moves · {fmt(seconds)}</div>
            <div className="flex gap-3">
              <button onClick={() => startGame(difficulty)} className="btn-primary flex-1 py-3 text-sm rounded-xl">
                Play Again
              </button>
              <button onClick={() => setDifficulty(null)} className="btn-secondary flex-1 py-3 text-sm rounded-xl">
                Change Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
