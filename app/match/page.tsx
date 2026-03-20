'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useSound } from '@/app/hooks/useSound';
import { useConfetti } from '@/app/hooks/useConfetti';

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
const DIFF_COLOR: Record<Difficulty, string> = { easy: '#6DC29B', moderate: '#5BB5D5', hard: '#F47C48' };

export default function MatchPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [locked, setLocked] = useState(false);
  const { playClick, playChime } = useSound();
  const { burst } = useConfetti();

  useEffect(() => { if (!running) return; const t = setInterval(() => setSeconds(s => s + 1), 1000); return () => clearInterval(t); }, [running]);

  const startGame = (diff: Difficulty) => {
    playClick();
    setDifficulty(diff); setCards(createCards(CARD_SETS[diff])); setFlipped([]); setMoves(0); setSeconds(0); setRunning(true); setSolved(false); setLocked(false);
  };

  const handleCardClick = useCallback((id: number) => {
    if (locked || solved) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    playClick();
    const newFlipped = [...flipped, id];
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards); setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1); setLocked(true);
      const [a, b] = newFlipped.map(fid => newCards.find(c => c.id === fid)!);
      if (a.emoji === b.emoji) {
        setTimeout(() => {
          const matched = newCards.map(c => c.id === a.id || c.id === b.id ? { ...c, matched: true } : c);
          setCards(matched); setFlipped([]); setLocked(false);
          if (matched.every(c => c.matched)) { setSolved(true); setRunning(false); playChime(); burst(); }
        }, 400);
      } else {
        setTimeout(() => { setCards(newCards.map(c => c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c)); setFlipped([]); setLocked(false); }, 900);
      }
    }
  }, [cards, flipped, locked, solved, playClick, playChime, burst]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const matchedCount = cards.filter(c => c.matched).length / 2;
  const totalPairs = cards.length / 2;

  if (!difficulty) {
    return (
      <main className="flex-1 flex flex-col w-full">
        <nav className="sticky top-0 z-50 bg-[#FEF8F0]/90 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-5 flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-[#A8A29E] hover:text-[#2D2A26] transition-colors">← Back</Link>
            <div className="w-px h-4 bg-[#E8E2D9]" />
            <span className="text-sm font-bold text-[#2D2A26]">Memory Match</span>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center py-16 sm:py-24">
          <div className="max-w-md w-full px-6">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
              <div className="w-20 h-20 rounded-3xl bg-[#5BB5D5] flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-[#5BB5D5]/25">🧠</div>
              <h1 className="text-3xl font-extrabold text-[#2D2A26] mb-2">Memory Match</h1>
              <p className="text-sm text-[#A8A29E]">Flip cards and find all matching pairs.</p>
            </motion.div>
            <div className="space-y-3">
              {(['easy', 'moderate', 'hard'] as Difficulty[]).map((d, i) => (
                <motion.button
                  key={d}
                  onClick={() => startGame(d)}
                  className="w-full rounded-2xl p-5 bg-white shadow-sm hover:shadow-md text-left flex items-center justify-between group transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div>
                    <div className="font-bold text-[#2D2A26] capitalize">{d}</div>
                    <div className="text-xs text-[#A8A29E] mt-0.5">{DIFF_META[d]}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{CARD_SETS[d].slice(0, 3).join('')}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${DIFF_COLOR[d]}15` }}>
                      <svg className="w-4 h-4" style={{ color: DIFF_COLOR[d] }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const color = DIFF_COLOR[difficulty];

  return (
    <main className="flex-1 flex flex-col w-full">
      <nav className="sticky top-0 z-50 bg-[#FEF8F0]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setDifficulty(null); setRunning(false); }} className="text-sm font-bold text-[#A8A29E] hover:text-[#2D2A26] transition-colors">← Change</button>
            <div className="w-px h-4 bg-[#E8E2D9]" />
            <span className="text-sm font-bold text-[#2D2A26] capitalize">🧠 {difficulty}</span>
          </div>
          <button onClick={() => startGame(difficulty)} className="text-xs font-bold text-[#A8A29E] hover:text-[#2D2A26] px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all">↺ Restart</button>
        </div>
      </nav>

      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-3 flex items-center gap-6">
          <div><span className="text-lg font-extrabold text-[#2D2A26]">{matchedCount}/{totalPairs}</span><span className="text-xs text-[#A8A29E] font-bold ml-1">pairs</span></div>
          <div className="w-px h-5 bg-[#E8E2D9]" />
          <div><span className="text-lg font-extrabold text-[#2D2A26]">{moves}</span><span className="text-xs text-[#A8A29E] font-bold ml-1">moves</span></div>
          <div className="w-px h-5 bg-[#E8E2D9]" />
          <div><span className="text-lg font-extrabold text-[#2D2A26]">{fmt(seconds)}</span><span className="text-xs text-[#A8A29E] font-bold ml-1">time</span></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-8">
        <div className={`grid ${GRID[difficulty]} gap-2.5 sm:gap-3 w-full max-w-md px-6`}>
          {cards.map((card, i) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="aspect-square flex items-center justify-center rounded-2xl cursor-pointer shadow-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: card.matched ? [1, 1.1, 1] : 1,
                rotateY: card.flipped || card.matched ? 0 : 180,
              }}
              transition={{
                opacity: { delay: i * 0.02, duration: 0.3 },
                scale: { delay: i * 0.02, duration: 0.3 },
                rotateY: { type: "spring", stiffness: 260, damping: 20 },
              }}
              style={{
                transformStyle: 'preserve-3d',
                backgroundColor: card.matched ? `${color}20` : card.flipped ? '#FFFFFF' : '#F0ECE6',
                border: card.matched ? `2px solid ${color}` : card.flipped ? '2px solid #E8E2D9' : '2px solid transparent',
              }}
            >
              <span className="text-2xl sm:text-3xl" style={{ opacity: card.flipped || card.matched ? 1 : 0 }}>
                {card.emoji}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {solved && (
          <motion.div
            className="pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="max-w-sm mx-auto rounded-3xl p-8 text-center bg-white shadow-sm">
              <div className="text-4xl mb-2">✨</div>
              <h2 className="text-xl font-extrabold text-[#2D2A26] mb-1">All Pairs Found!</h2>
              <p className="text-sm text-[#A8A29E] mb-6">{moves} moves · {fmt(seconds)}</p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => startGame(difficulty)} className="flex-1 bg-[#F47C48] text-white font-bold py-3.5 rounded-full text-sm shadow-md shadow-[#F47C48]/25">Play Again</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setDifficulty(null)} className="flex-1 bg-white text-[#2D2A26] font-bold py-3.5 rounded-full text-sm shadow-sm border border-[#E8E2D9]">Change Mode</motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
