'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

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
  const [slideAnim, setSlideAnim] = useState<number | null>(null);

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
    const newBoard = [...board];
    [newBoard[idx], newBoard[emptyIdx]] = [newBoard[emptyIdx], newBoard[idx]];
    setSlideAnim(idx);
    setTimeout(() => setSlideAnim(null), 150);
    setBoard(newBoard);
    setMoves(m => m + 1);
    if (isSolved(newBoard)) {
      setSolved(true);
      setRunning(false);
    }
  }, [board, size, solved]);

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
      <main className="flex-1 flex flex-col w-full px-6 sm:px-12 lg:px-20">
        {/* Nav */}
        <nav className="py-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Back
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-sm font-medium text-white/70">🧩 Slide Puzzle</span>
          </div>
        </nav>

        <div className="flex-1 flex flex-col justify-center py-8 max-w-2xl mx-auto w-full">
          {/* Image selection */}
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Choose your scene</h2>
            <div className="grid grid-cols-3 gap-3">
              {IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIdx(i)}
                  className={`aspect-square rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                    imageIdx === i ? 'border-violet-500 scale-[1.02] shadow-lg shadow-violet-500/20' : 'border-transparent opacity-50 hover:opacity-75'
                  }`}
                  style={{ backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  title={img.label}
                />
              ))}
            </div>
            <p className="text-sm text-white/40 text-center mt-3 font-medium">{IMAGES[imageIdx].label}</p>
          </div>

          {/* Difficulty */}
          <div>
            <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Select difficulty</h2>
            <div className="space-y-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.label}
                  onClick={() => startGame(d)}
                  className="w-full glass glass-hover rounded-xl p-5 text-left flex items-center justify-between group transition-all duration-200"
                >
                  <div>
                    <div className="font-semibold text-white/90 text-base">{d.label}</div>
                    <div className="text-xs text-white/30 mt-0.5">{d.desc}</div>
                  </div>
                  <svg className="w-5 h-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
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
          <span className="text-sm font-medium text-white/70">🧩 {difficulty.label} · {image.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPreview(v => !v)} className="btn-secondary text-xs px-3 py-1.5">
            {showPreview ? 'Hide' : 'Peek'}
          </button>
          <button onClick={() => startGame(difficulty)} className="btn-secondary text-xs px-3 py-1.5">
            ↺ Restart
          </button>
        </div>
      </nav>

      {/* Stats */}
      <div className="flex items-center gap-6 py-4 border-b border-white/5">
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

      {/* Preview */}
      {showPreview && (
        <div className="fade-in overflow-hidden rounded-xl mt-4 border border-white/10">
          <img src={image.url} alt={image.label} className="w-full object-cover" style={{ maxHeight: 160 }} />
        </div>
      )}

      {/* Board */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div
          className="relative overflow-hidden rounded-xl"
          style={{ width: boardPx, height: boardPx, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
        >
          {board.map((tile, idx) => {
            if (tile === 0) return (
              <div
                key="empty"
                className="absolute"
                style={{
                  width: tileSize,
                  height: tileSize,
                  left: (idx % size) * tileSize,
                  top: Math.floor(idx / size) * tileSize,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
              />
            );
            const origRow = Math.floor((tile - 1) / size);
            const origCol = (tile - 1) % size;
            return (
              <div
                key={tile}
                className={`absolute tile ${slideAnim === idx ? 'tile-slide' : ''}`}
                style={{
                  width: tileSize - 2,
                  height: tileSize - 2,
                  left: (idx % size) * tileSize + 1,
                  top: Math.floor(idx / size) * tileSize + 1,
                  backgroundImage: `url(${image.url})`,
                  backgroundSize: `${boardPx}px ${boardPx}px`,
                  backgroundPosition: `-${origCol * tileSize}px -${origRow * tileSize}px`,
                  transition: 'left 0.12s ease, top 0.12s ease',
                  borderRadius: 4,
                  outline: solved ? '2px solid rgba(167,139,250,0.5)' : 'none',
                }}
                onClick={() => handleTileClick(idx)}
                onTouchStart={e => handleTouchStart(e, idx)}
              />
            );
          })}
        </div>

        {!solved && (
          <p className="text-xs text-white/20 mt-5">Tap a tile next to the empty space</p>
        )}
      </div>

      {/* Solved */}
      {solved && (
        <div className="fade-up pb-8">
          <div className="glass rounded-2xl p-8 text-center max-w-sm mx-auto glow-purple">
            <div className="text-4xl mb-3">🎉</div>
            <div className="text-xl font-bold text-white mb-1">Puzzle Complete!</div>
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
