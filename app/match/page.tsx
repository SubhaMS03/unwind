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
            <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
              <div className="text-5xl mb-5">🧠</div>
              <h1 className="text-3xl font-bold text-white mb-2">Memory Match</h1>
              <p className="text-sm text-white/40">Flip cards and find all matching pairs.</p>
            </motion.div>
            <div className="space-y-3">
              {(['easy', 'moderate', 'hard'] as Difficulty[]).map((d, i) => (
                <motion.button
                  key={d}
                  onClick={() => startGame(d)}
                  className="w-full rounded-2xl p-5 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-left flex items-center justify-between group transition-colors duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div>
                    <div className="font-semibold text-white capitalize">{d}</div>
                    <div className="text-xs text-white/35 mt-0.5">{DIFF_META[d]}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{CARD_SETS[d].slice(0, 3).join('')}</span>
                    <svg className="w-5 h-5 text-white/20 group-hover:text-[#82C9E5] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </motion.button>
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
          {cards.map((card, i) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="aspect-square flex items-center justify-center rounded-xl cursor-pointer"
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
                backgroundColor: card.matched ? 'rgba(124,92,191,0.2)' : card.flipped ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                border: card.matched ? '1px solid rgba(124,92,191,0.3)' : card.flipped ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)',
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
            className="pb-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="max-w-sm mx-auto rounded-2xl p-8 text-center bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
              <div className="text-4xl mb-2">✨</div>
              <h2 className="text-xl font-bold text-white mb-1">All Pairs Found!</h2>
              <p className="text-sm text-white/40 mb-6">{moves} moves · {fmt(seconds)}</p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => startGame(difficulty)} className="flex-1 bg-[#7C5CBF] text-white font-semibold py-3 rounded-full text-sm hover:bg-[#6A4DAD] transition-colors">Play Again</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setDifficulty(null)} className="flex-1 bg-white/[0.06] text-white font-semibold py-3 rounded-full text-sm hover:bg-white/[0.1] border border-white/[0.06] transition-colors">Change Mode</motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
