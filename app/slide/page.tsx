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
      <main className="flex-1 flex flex-col w-full px-6 sm:px-12 lg:px-24">
        <nav className="border-b-2 border-black py-5 flex items-center gap-3">
          <Link href="/" className="text-sm opacity-60 hover:opacity-100 transition-opacity font-black uppercase tracking-widest">← Back</Link>
          <span className="opacity-20">|</span>
          <span className="font-black uppercase tracking-widest text-sm">🧩 Slide Puzzle</span>
        </nav>

        <div className="flex-1 flex flex-col justify-center py-8">
          {/* Image selection */}
          <div className="border-2 border-black mb-6" style={{ boxShadow: '4px 4px 0 #000' }}>
            <div className="bg-black text-white px-5 py-3">
              <span className="font-black uppercase tracking-widest text-xs">Choose Your Scene</span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-3">
                {IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIdx(i)}
                    className={`aspect-square overflow-hidden transition-all border-2 ${imageIdx === i ? 'border-black' : 'border-transparent opacity-40 hover:opacity-70'}`}
                    style={{ backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    title={img.label}
                  />
                ))}
              </div>
              <p className="text-xs opacity-50 text-center uppercase tracking-widest font-black">{IMAGES[imageIdx].label}</p>
            </div>
          </div>

          {/* Difficulty */}
          <div className="text-xs uppercase tracking-widest opacity-50 mb-3 px-1 font-black">Difficulty</div>
          <div>
            {DIFFICULTIES.map((d, i) => (
              <button
                key={d.label}
                onClick={() => startGame(d)}
                className={`w-full border-2 border-black p-5 text-left hover:bg-black hover:text-white transition-colors group flex items-center justify-between ${i > 0 ? '-mt-[2px]' : ''}`}
                style={{ boxShadow: i === DIFFICULTIES.length - 1 ? '4px 4px 0 #000' : undefined }}
              >
                <div>
                  <div className="font-black uppercase tracking-widest text-base">{d.label}</div>
                  <div className="text-xs opacity-50 mt-0.5">{d.desc}</div>
                </div>
                <span className="font-black opacity-30 group-hover:opacity-100 text-lg">→</span>
              </button>
            ))}
          </div>
        </div>

        <footer className="border-t-2 border-black py-5 flex items-center justify-between">
          <span className="font-black uppercase tracking-widest text-sm">[ UNWIND ]</span>
          <span className="text-xs opacity-40">Slide Puzzle</span>
        </footer>
      </main>
    );
  }

  // Game screen
  return (
    <main className="flex-1 flex flex-col w-full px-6 sm:px-12 lg:px-24">
      <nav className="border-b-2 border-black py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => { setDifficulty(null); setRunning(false); }} className="text-sm opacity-60 hover:opacity-100 transition-opacity font-black uppercase tracking-widest">← Change</button>
          <span className="opacity-20">|</span>
          <span className="font-black uppercase tracking-widest text-sm">🧩 {difficulty.label} · {image.label}</span>
        </div>
        <button onClick={() => setShowPreview(v => !v)} className="text-xs border-2 border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors uppercase tracking-widest font-black">
          {showPreview ? 'Hide' : 'Peek'}
        </button>
      </nav>

      {/* Stats bar */}
      <div className="border-b-2 border-black flex">
        <div className="flex-1 border-r-2 border-black p-4 text-center">
          <div className="font-black text-2xl">{moves}</div>
          <div className="text-xs uppercase tracking-widest opacity-50">Moves</div>
        </div>
        <div className="flex-1 border-r-2 border-black p-4 text-center">
          <div className="font-black text-2xl">{fmt(seconds)}</div>
          <div className="text-xs uppercase tracking-widest opacity-50">Time</div>
        </div>
        <div className="p-4 flex items-center">
          <button onClick={() => startGame(difficulty)} className="border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
            ↺ Restart
          </button>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="border-b-2 border-black fade-in overflow-hidden">
          <img src={image.url} alt={image.label} className="w-full object-cover" style={{ maxHeight: 160 }} />
        </div>
      )}

      {/* Board */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div
          className="relative overflow-hidden"
          style={{ width: boardPx, height: boardPx, border: '2px solid black', boxShadow: '4px 4px 0 #000' }}
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
                  backgroundColor: '#f5f5f5',
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
                  outline: solved ? '2px solid black' : 'none',
                }}
                onClick={() => handleTileClick(idx)}
                onTouchStart={e => handleTouchStart(e, idx)}
              />
            );
          })}
        </div>

        {!solved && (
          <p className="text-xs opacity-30 uppercase tracking-widest mt-5 font-black">Tap a tile next to the empty space</p>
        )}
      </div>

      {/* Solved */}
      {solved && (
        <div className="fade-in border-t-2 border-black" style={{ boxShadow: '0 -4px 0 #000' }}>
          <div className="bg-black text-white px-6 py-4 text-center">
            <div className="text-3xl mb-1">🎉</div>
            <div className="font-black text-xl uppercase tracking-widest">Puzzle Complete!</div>
            <div className="text-xs opacity-60 mt-1">{moves} moves · {fmt(seconds)}</div>
          </div>
          <div className="p-5 flex gap-3">
            <button onClick={() => startGame(difficulty)} className="flex-1 bg-black text-white border-2 border-black py-3 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors">
              Play Again
            </button>
            <button onClick={() => setDifficulty(null)} className="flex-1 border-2 border-black py-3 font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
              Change Mode
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
