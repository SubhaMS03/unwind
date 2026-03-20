'use client';

import { createContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';

interface SoundContextType {
  muted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playChime: () => void;
  startAmbient: () => void;
  stopAmbient: () => void;
}

export const SoundContext = createContext<SoundContextType>({
  muted: false,
  toggleMute: () => {},
  playClick: () => {},
  playChime: () => {},
  startAmbient: () => {},
  stopAmbient: () => {},
});

export function Providers({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const initRef = useRef(false);

  // Load muted state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('unwind-muted');
    setMuted(stored === null ? false : stored === 'true');
  }, []);

  // Lazily create AudioContext on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (initRef.current) return;
      initRef.current = true;
      try {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch { /* no audio support */ }
      document.removeEventListener('pointerdown', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
    document.addEventListener('pointerdown', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
    return () => {
      document.removeEventListener('pointerdown', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      localStorage.setItem('unwind-muted', String(next));
      if (next && ambientRef.current) {
        ambientRef.current.gain.gain.setValueAtTime(0, audioCtxRef.current?.currentTime ?? 0);
      }
      return next;
    });
  }, []);

  const playClick = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  }, [muted]);

  const playChime = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || muted) return;
    // Two harmonically related tones
    [523, 659].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.6);
    });
  }, [muted]);

  const startAmbient = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || muted || ambientRef.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    ambientRef.current = { osc, gain };
  }, [muted]);

  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      const ctx = audioCtxRef.current;
      const t = ctx?.currentTime ?? 0;
      ambientRef.current.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      ambientRef.current.osc.stop(t + 0.5);
      ambientRef.current = null;
    }
  }, []);

  return (
    <SoundContext.Provider value={{ muted, toggleMute, playClick, playChime, startAmbient, stopAmbient }}>
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>

      {/* Mute toggle — fixed bottom-right */}
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-[100] w-10 h-10 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.1] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </SoundContext.Provider>
  );
}
