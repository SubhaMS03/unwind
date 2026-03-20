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
  { label: 'Easy', grid: 3, desc: '8 tiles · Relaxed' },
  { label: 'Moderate', grid: 4, desc: '15 tiles · Focused' },
  { label: 'Hard', grid: 5, desc: '24 tiles · Challenging' },
];

function createBoard(size: number): number[] {
  const total = size * size;
  const board = Array.from({ length: total }, (_, i) => i);
  // Shuffle ensuring solvability
  let shuffled = [...board];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Ensure solvable
  if (!isSolvable(shuffled, size)) {
    // Swap first two non-empty tiles
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

  // Swipe support
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

  if (!difficulty) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center">
        <div className="w-full max-w-lg px-6">
          <nav className="py-5 flex items-center gap-3 border-b border-gray-100">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-800 transition-colors">← Back</Link>
            <span className="text-gray-200">|</span>
            <span className="font-semibold text-sm">🧩 Slide Puzzle</span>
          </nav>

          <div className="pt-10 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Choose your scene</h1>
            <p className="text-gray-400 text-sm">Pick an image and a difficulty to begin.</p>
          </div>

          {/* Image picker */}
          <div className="mt-8 mb-8">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Image</div>
            <div className="grid grid-cols-3 gap-2">
              {IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIdx(i)}
                  className={`aspect-square rounded-xl overflow-hidden transition-all ${imageIdx === i ? 'ring-2 ring-black scale-105' : 'opacity-50 hover:opacity-80'}`}
                  style={{ backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  title={img.label}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">{IMAGES[imageIdx].label}</p>
          </div>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Difficulty</div>
          <div className="space-y-2 pb-10">
            {DIFFICULTIES.map(d => (
              <button
                key={d.label}
                onClick={() => startGame(d)}
                className="w-full border border-gray-100 rounded-xl p-4 text-left hover:border-gray-300 hover:bg-gray-50 transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-gray-900">{d.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{d.desc}</div>
                </div>
                <span className="text-gray-300 group-hover:text-gray-600 transition-colors">→</span>
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
            <span className="font-semibold text-sm">🧩 {difficulty.label} · {image.label}</span>
          </div>
          <button onClick={() => setShowPreview(v => !v)} className="text-xs text-gray-400 hover:text-gray-700 transition-colors border border-gray-100 px-3 py-1.5 rounded-full hover:border-gray-300">
            {showPreview ? 'Hide' : 'Peek'} image
          </button>
        </nav>

        {/* Stats */}
        <div className="flex items-center justify-between py-5 border-b border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold">{moves}</div>
            <div className="text-xs text-gray-400 mt-0.5">moves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{fmt(seconds)}</div>
            <div className="text-xs text-gray-400 mt-0.5">time</div>
          </div>
          <button onClick={() => startGame(difficulty)} className="text-xs border border-gray-200 px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
            ↺ Restart
          </button>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="mt-4 rounded-xl overflow-hidden fade-in">
            <img src={image.url} alt={image.label} className="w-full object-cover" style={{ maxHeight: 180 }} />
          </div>
        )}

        {/* Board */}
        <div className="flex justify-center py-6">
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ width: boardPx, height: boardPx, border: '2px solid #e5e7eb' }}
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
                    backgroundColor: '#f3f4f6',
                  }}
                />
              );
              const origRow = Math.floor((tile - 1) / size);
              const origCol = (tile - 1) % size;
              return (
                <div
                  key={tile}
                  className={`absolute tile ${slideAnim === idx ? 'tile-slide' : ''} ${solved ? 'win-glow' : ''}`}
                  style={{
                    width: tileSize - 2,
                    height: tileSize - 2,
                    left: (idx % size) * tileSize + 1,
                    top: Math.floor(idx / size) * tileSize + 1,
                    backgroundImage: `url(${image.url})`,
                    backgroundSize: `${boardPx}px ${boardPx}px`,
                    backgroundPosition: `-${origCol * tileSize}px -${origRow * tileSize}px`,
                    borderRadius: 4,
                    transition: 'left 0.12s ease, top 0.12s ease',
                  }}
                  onClick={() => handleTileClick(idx)}
                  onTouchStart={e => handleTouchStart(e, idx)}
                />
              );
            })}
          </div>
        </div>

        {/* Solved */}
        {solved && (
          <div className="fade-in border border-gray-200 rounded-2xl p-6 mb-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <div className="font-extrabold text-xl mb-1">Puzzle Complete!</div>
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

        {!solved && (
          <p className="text-center text-xs text-gray-300 pb-6">Tap a tile next to the empty space to slide it</p>
        )}
      </div>
    </div>
  );
}
