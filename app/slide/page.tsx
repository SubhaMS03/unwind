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
      <main className="flex-1 flex flex-col w-full relative overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute bottom-[-5%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#5BA87C]/12 blur-[120px]" />
          <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#D4845A]/8 blur-[100px]" />
        </div>
        <nav className="sticky top-0 z-50 bg-[#0F0B15]/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-white/40 hover:text-white transition-colors">← Back</Link>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-sm font-semibold text-white">Slide Puzzle</span>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center py-16 relative z-10">
          <div className="max-w-md w-full px-6">
            <div className="text-center mb-8">
              <div className="text-5xl mb-5">🏔️</div>
              <h1 className="text-3xl font-bold text-white mb-2">Choose your scene</h1>
              <p className="text-sm text-white/40">Pick an image, then select difficulty.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIdx(i)}
                  className={`aspect-square rounded-2xl overflow-hidden transition-all duration-200 border-2 ${
                    imageIdx === i ? 'border-[#82C9A5] shadow-lg shadow-[#5BA87C]/20 scale-[1.02]' : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                  style={{ backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-white/50 text-center mb-8">{IMAGES[imageIdx].label}</p>

            <div className="space-y-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.label}
                  onClick={() => startGame(d)}
                  className="w-full rounded-2xl p-5 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-left flex items-center justify-between group transition-all duration-200"
                >
                  <div>
                    <div className="font-semibold text-white">{d.label}</div>
                    <div className="text-xs text-white/35 mt-0.5">{d.desc}</div>
                  </div>
                  <svg className="w-5 h-5 text-white/20 group-hover:text-[#82C9A5] group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
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
    <main className="flex-1 flex flex-col w-full relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#5BA87C]/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-[#D4845A]/8 blur-[100px]" />
      </div>
      <nav className="sticky top-0 z-50 bg-[#0F0B15]/70 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setDifficulty(null); setRunning(false); }} className="text-sm font-medium text-white/40 hover:text-white transition-colors">← Change</button>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-sm font-semibold text-white">🏔️ {difficulty.label} · {image.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(v => !v)} className="text-xs font-medium text-white/40 hover:text-white px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] transition-all">
              {showPreview ? 'Hide' : 'Peek'}
            </button>
            <button onClick={() => startGame(difficulty)} className="text-xs font-medium text-white/40 hover:text-white px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] transition-all">
              ↺ Restart
            </button>
          </div>
        </div>
      </nav>

      {/* Stats */}
      <div className="border-b border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
          <div className="text-center">
            <span className="text-lg font-bold text-white">{moves}</span>
            <span className="text-xs text-white/35 ml-1">moves</span>
          </div>
          <div className="w-px h-5 bg-white/10" />
          <div className="text-center">
            <span className="text-lg font-bold text-white">{fmt(seconds)}</span>
            <span className="text-xs text-white/35 ml-1">time</span>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="max-w-5xl mx-auto px-6 pt-4 relative z-10">
          <img src={image.url} alt={image.label} className="w-full max-h-40 object-cover rounded-xl opacity-80" />
        </div>
      )}

      {/* Board */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 relative z-10">
        <div
          className="relative overflow-hidden rounded-xl"
          style={{ width: boardPx, height: boardPx, boxShadow: '0 4px 40px rgba(0,0,0,0.3)' }}
        >
          {board.map((tile, idx) => {
            if (tile === 0) return (
              <div key="empty" className="absolute" style={{ width: tileSize, height: tileSize, left: (idx % size) * tileSize, top: Math.floor(idx / size) * tileSize, backgroundColor: '#1a1520' }} />
            );
            const origRow = Math.floor((tile - 1) / size);
            const origCol = (tile - 1) % size;
            return (
              <div
                key={tile}
                className={`absolute tile ${slideAnim === idx ? 'tile-slide' : ''}`}
                style={{
                  width: tileSize - 2, height: tileSize - 2,
                  left: (idx % size) * tileSize + 1, top: Math.floor(idx / size) * tileSize + 1,
                  backgroundImage: `url(${image.url})`, backgroundSize: `${boardPx}px ${boardPx}px`,
                  backgroundPosition: `-${origCol * tileSize}px -${origRow * tileSize}px`,
                  transition: 'left 0.12s ease, top 0.12s ease', borderRadius: 6,
                }}
                onClick={() => handleTileClick(idx)}
                onTouchStart={e => handleTouchStart(e, idx)}
              />
            );
          })}
        </div>
        {!solved && <p className="text-xs text-white/20 mt-5">Tap a tile next to the empty space</p>}
      </div>

      {/* Solved */}
      {solved && (
        <div className="fade-up pb-8 relative z-10">
          <div className="max-w-sm mx-auto rounded-2xl p-8 text-center bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-white mb-1">Puzzle Complete!</h2>
            <p className="text-sm text-white/40 mb-6">{moves} moves · {fmt(seconds)}</p>
            <div className="flex gap-3">
              <button onClick={() => startGame(difficulty)} className="flex-1 bg-[#7C5CBF] text-white font-semibold py-3 rounded-full text-sm hover:bg-[#6A4DAD] transition-colors">Play Again</button>
              <button onClick={() => setDifficulty(null)} className="flex-1 bg-white/[0.06] text-white font-semibold py-3 rounded-full text-sm hover:bg-white/[0.1] border border-white/[0.06] transition-colors">Change Mode</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
