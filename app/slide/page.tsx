'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useSound } from '@/app/hooks/useSound';
import { useConfetti } from '@/app/hooks/useConfetti';

const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', label: 'Mountain Lake' },
  { url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80', label: 'Forest Path' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', label: 'Tropical Beach' },
  { url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600&q=80', label: 'Desert Dunes' },
  { url: 'https://images.unsplash.com/photo-1490750967868-88df5691166a?w=600&q=80', label: 'Cherry Blossoms' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', label: 'Rocky Mountains' },
];

const DIFFICULTIES = [
  { label: 'Easy', grid: 3, desc: '3×3 · 8 tiles' },
  { label: 'Moderate', grid: 4, desc: '4×4 · 15 tiles' },
  { label: 'Hard', grid: 5, desc: '5×5 · 24 tiles' },
];

function createBoard(size: number): number[] {
  const total = size * size;
  const board = Array.from({ length: total }, (_, i) => i);
  const shuffled = [...board];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  if (!isSolvable(shuffled, size)) {
    const idx1 = shuffled.findIndex(t => t !== 0);
    const idx2 = shuffled.findIndex((t, i) => t !== 0 && i !== idx1);
    [shuffled[idx1], shuffled[idx2]] = [shuffled[idx2], shuffled[idx1]];
  }
  return shuffled;
}

function isSolvable(board: number[], size: number): boolean {
  const flat = board.filter(t => t !== 0);
  let inversions = 0;
  for (let i = 0; i < flat.length; i++)
    for (let j = i + 1; j < flat.length; j++)
      if (flat[i] > flat[j]) inversions++;
  const emptyRow = Math.floor(board.indexOf(0) / size);
  if (size % 2 === 1) return inversions % 2 === 0;
  return (inversions + emptyRow) % 2 === 1;
}

function isSolved(board: number[]): boolean {
  return board.every((t, i) => t === (i === board.length - 1 ? 0 : i + 1));
}

export default function SlidePage() {
  const [difficulty, setDifficulty] = useState<null | typeof DIFFICULTIES[0]>(null);
  const [imageIdx, setImageIdx] = useState(0);
  const [board, setBoard] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { playClick, playChime } = useSound();
  const { burst } = useConfetti();

  const size = difficulty?.grid ?? 3;
  const tileSize = size === 3 ? 140 : size === 4 ? 105 : 84;
  const boardPx = tileSize * size;
  const image = IMAGES[imageIdx];

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const startGame = (diff: typeof DIFFICULTIES[0]) => {
    playClick();
    setDifficulty(diff);
    setBoard(createBoard(diff.grid));
    setMoves(0);
    setSeconds(0);
    setRunning(true);
    setSolved(false);
  };

  const handleTileClick = useCallback((idx: number) => {
    if (solved) return;
    const emptyIdx = board.indexOf(0);
    const row = Math.floor(idx / size);
    const col = idx % size;
    const emptyRow = Math.floor(emptyIdx / size);
    const emptyCol = emptyIdx % size;
    const adjacent =
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1);
    if (!adjacent) return;
    playClick();
    const newBoard = [...board];
    [newBoard[idx], newBoard[emptyIdx]] = [newBoard[emptyIdx], newBoard[idx]];
    setBoard(newBoard);
    setMoves(m => m + 1);
    if (isSolved(newBoard)) {
      setSolved(true);
      setRunning(false);
      playChime();
      burst();
    }
  }, [board, size, solved, playClick, playChime, burst]);

  const handleTouchStart = useCallback((e: React.TouchEvent, idx: number) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const handleTouchEnd = (e2: TouchEvent) => {
      const t = e2.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const row = Math.floor(idx / size);
      const col = idx % size;
      const emptyIdx = board.indexOf(0);
      const emptyRow = Math.floor(emptyIdx / size);
      const emptyCol = emptyIdx % size;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20 && emptyCol === col + 1 && emptyRow === row) handleTileClick(idx);
        if (dx < -20 && emptyCol === col - 1 && emptyRow === row) handleTileClick(idx);
      } else {
        if (dy > 20 && emptyRow === row + 1 && emptyCol === col) handleTileClick(idx);
        if (dy < -20 && emptyRow === row - 1 && emptyCol === col) handleTileClick(idx);
      }
      document.removeEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('touchend', handleTouchEnd);
  }, [board, size, handleTileClick]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Selection screen
  if (!difficulty) {
    return (
      <main className="flex-1 flex flex-col w-full">
        <nav className="sticky top-0 z-50 bg-[#F9F7F4]/80 backdrop-blur-lg border-b border-[#E8E4DF]">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-[#8B8680] hover:text-[#2D2A26] transition-colors">← Back</Link>
            <div className="w-px h-4 bg-[#E8E4DF]" />
            <span className="text-sm font-semibold text-[#2D2A26]">Slide Puzzle</span>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center py-20 sm:py-28">
          <div className="max-w-md w-full px-6">
            <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
              <div className="text-5xl mb-5">🏔️</div>
              <h1 className="text-3xl font-bold text-[#2D2A26] mb-2">Choose your scene</h1>
              <p className="text-sm text-[#8B8680]">Pick an image, then select difficulty.</p>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {IMAGES.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => { setImageIdx(i); playClick(); }}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 ${
                    imageIdx === i ? 'border-[#7BAF8E] shadow-lg shadow-[#7BAF8E]/15' : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                  style={{ backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: imageIdx === i ? 1 : 0.4, scale: imageIdx === i ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-[#8B8680] text-center mb-8">{IMAGES[imageIdx].label}</p>

            <div className="space-y-3">
              {DIFFICULTIES.map((d, i) => (
                <motion.button
                  key={d.label}
                  onClick={() => startGame(d)}
                  className="w-full rounded-2xl p-5 bg-white border border-[#EBE8E4] hover:shadow-md hover:border-[#DDD9D4] text-left flex items-center justify-between group transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div>
                    <div className="font-semibold text-[#2D2A26]">{d.label}</div>
                    <div className="text-xs text-[#8B8680] mt-0.5">{d.desc}</div>
                  </div>
                  <svg className="w-5 h-5 text-[#CBC6C0] group-hover:text-[#7BAF8E] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Game screen
  return (
    <main className="flex-1 flex flex-col w-full">
      <nav className="sticky top-0 z-50 bg-[#F9F7F4]/80 backdrop-blur-lg border-b border-[#E8E4DF]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setDifficulty(null); setRunning(false); }} className="text-sm font-medium text-[#8B8680] hover:text-[#2D2A26] transition-colors">← Change</button>
            <div className="w-px h-4 bg-[#E8E4DF]" />
            <span className="text-sm font-semibold text-[#2D2A26]">🏔️ {difficulty.label} · {image.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowPreview(v => !v); playClick(); }} className="text-xs font-medium text-[#8B8680] hover:text-[#2D2A26] px-4 py-2 rounded-full bg-white border border-[#EBE8E4] hover:border-[#DDD9D4] transition-all">
              {showPreview ? 'Hide' : 'Peek'}
            </button>
            <button onClick={() => startGame(difficulty)} className="text-xs font-medium text-[#8B8680] hover:text-[#2D2A26] px-4 py-2 rounded-full bg-white border border-[#EBE8E4] hover:border-[#DDD9D4] transition-all">
              ↺ Restart
            </button>
          </div>
        </div>
      </nav>

      {/* Stats */}
      <div className="border-b border-[#EBE8E4]">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-6">
          <div><span className="text-lg font-bold text-[#2D2A26]">{moves}</span><span className="text-xs text-[#8B8680] ml-1">moves</span></div>
          <div className="w-px h-5 bg-[#E8E4DF]" />
          <div><span className="text-lg font-bold text-[#2D2A26]">{fmt(seconds)}</span><span className="text-xs text-[#8B8680] ml-1">time</span></div>
        </div>
      </div>

      {/* Preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="max-w-3xl mx-auto px-6 pt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <img src={image.url} alt={image.label} className="w-full max-h-40 object-cover rounded-xl opacity-80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div
          className="relative overflow-hidden rounded-xl"
          style={{ width: boardPx, height: boardPx, boxShadow: '0 2px 24px rgba(0,0,0,0.08)' }}
        >
          {board.map((tile, idx) => {
            if (tile === 0) return (
              <div key="empty" className="absolute" style={{ width: tileSize, height: tileSize, left: (idx % size) * tileSize, top: Math.floor(idx / size) * tileSize, backgroundColor: '#F0EDEA' }} />
            );
            const origRow = Math.floor((tile - 1) / size);
            const origCol = (tile - 1) % size;
            return (
              <motion.div
                key={tile}
                className="absolute tile cursor-pointer"
                animate={{
                  left: (idx % size) * tileSize + 1,
                  top: Math.floor(idx / size) * tileSize + 1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  width: tileSize - 2, height: tileSize - 2,
                  backgroundImage: `url(${image.url})`, backgroundSize: `${boardPx}px ${boardPx}px`,
                  backgroundPosition: `-${origCol * tileSize}px -${origRow * tileSize}px`,
                  borderRadius: 6,
                }}
                onClick={() => handleTileClick(idx)}
                onTouchStart={e => handleTouchStart(e, idx)}
                whileHover={{ filter: 'brightness(1.05)' }}
              />
            );
          })}
        </div>
        {!solved && <p className="text-xs text-[#CBC6C0] mt-5">Tap a tile next to the empty space</p>}
      </div>

      {/* Solved */}
      <AnimatePresence>
        {solved && (
          <motion.div
            className="pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="max-w-sm mx-auto rounded-2xl p-8 text-center bg-white border border-[#EBE8E4] shadow-sm">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-xl font-bold text-[#2D2A26] mb-1">Puzzle Complete!</h2>
              <p className="text-sm text-[#8B8680] mb-6">{moves} moves · {fmt(seconds)}</p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => startGame(difficulty)} className="flex-1 bg-[#8B7EC8] text-white font-semibold py-3 rounded-full text-sm hover:bg-[#7A6DB7] transition-colors shadow-md">Play Again</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setDifficulty(null)} className="flex-1 bg-white text-[#2D2A26] font-semibold py-3 rounded-full text-sm hover:bg-[#F5F3F0] border border-[#EBE8E4] transition-colors">Change Mode</motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
