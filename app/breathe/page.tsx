'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const EXERCISES = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Used by Navy SEALs to stay calm under pressure.',
    emoji: '⬜',
    color: 'violet',
    phases: [
      { label: 'Inhale', duration: 4 },
      { label: 'Hold', duration: 4 },
      { label: 'Exhale', duration: 4 },
      { label: 'Hold', duration: 4 },
    ],
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'A natural tranquilizer for the nervous system.',
    emoji: '🌙',
    color: 'blue',
    phases: [
      { label: 'Inhale', duration: 4 },
      { label: 'Hold', duration: 7 },
      { label: 'Exhale', duration: 8 },
    ],
  },
  {
    id: 'calm',
    name: 'Calm Breath',
    description: 'Simple slow breathing to reduce anxiety instantly.',
    emoji: '🌊',
    color: 'emerald',
    phases: [
      { label: 'Inhale', duration: 5 },
      { label: 'Exhale', duration: 6 },
    ],
  },
];

type Exercise = typeof EXERCISES[0];

const GLOW: Record<string, string> = {
  violet: '0 0 80px rgba(167,139,250,0.15), 0 0 30px rgba(167,139,250,0.1)',
  blue: '0 0 80px rgba(96,165,250,0.15), 0 0 30px rgba(96,165,250,0.1)',
  emerald: '0 0 80px rgba(52,211,153,0.15), 0 0 30px rgba(52,211,153,0.1)',
};

const RING_COLOR: Record<string, string> = {
  violet: 'rgba(167,139,250,0.3)',
  blue: 'rgba(96,165,250,0.3)',
  emerald: 'rgba(52,211,153,0.3)',
};

const BADGE_STYLE: Record<string, string> = {
  violet: 'bg-violet-500/20 text-violet-300 border-violet-500/20',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/20',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
};

export default function BreathePage() {
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [done, setDone] = useState(false);
  const [targetCycles] = useState(4);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (!running || !selected) return;

    timerRef.current = setInterval(() => {
      setPhaseSeconds(prev => {
        const phaseDuration = selected.phases[phaseIdx].duration;
        const next = prev + 1;

        if (next >= phaseDuration) {
          const nextPhaseIdx = (phaseIdx + 1) % selected.phases.length;
          setPhaseIdx(nextPhaseIdx);

          if (nextPhaseIdx === 0) {
            setCycles(c => {
              const newCycles = c + 1;
              if (newCycles >= targetCycles) {
                setRunning(false);
                setDone(true);
              }
              return newCycles;
            });
          }
          setTotalSeconds(s => s + 1);
          return 0;
        }
        setTotalSeconds(s => s + 1);
        return next;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, selected, phaseIdx, targetCycles]);

  const startExercise = (ex: Exercise) => {
    setSelected(ex);
    setRunning(false);
    setPhaseIdx(0);
    setPhaseSeconds(0);
    setCycles(0);
    setTotalSeconds(0);
    setDone(false);
  };

  const toggleRunning = () => {
    if (done) return;
    setRunning(r => !r);
  };

  const restart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhaseIdx(0);
    setPhaseSeconds(0);
    setCycles(0);
    setTotalSeconds(0);
    setDone(false);
    setRunning(false);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const getCircleScale = () => {
    if (!selected || !running) return 1;
    const phase = selected.phases[phaseIdx];
    const progress = phaseSeconds / phase.duration;
    if (phase.label === 'Inhale') return 0.6 + 0.4 * progress;
    if (phase.label === 'Exhale') return 1 - 0.4 * progress;
    if (phase.label === 'Hold') return phaseIdx === 1 ? 1 : 0.6;
    return 1;
  };

  const circleScale = getCircleScale();

  // Selection screen
  if (!selected) {
    return (
      <main className="flex-1 flex flex-col w-full px-6 sm:px-12 lg:px-20">
        <nav className="py-5 flex items-center gap-4 border-b border-white/5">
          <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-sm font-medium text-white/70">🌬️ Just Breathe</span>
        </nav>

        <div className="flex-1 flex flex-col justify-center py-8 max-w-lg mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Just Breathe</h1>
            <p className="text-sm text-white/40">Guided breathing to calm your nervous system. 4 cycles per session.</p>
          </div>

          <div className="space-y-3">
            {EXERCISES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => startExercise(ex)}
                className="w-full glass glass-hover rounded-xl p-5 text-left group transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl flex-shrink-0 mt-0.5">{ex.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white/90">{ex.name}</div>
                    <div className="text-xs text-white/30 mt-0.5 mb-3">{ex.description}</div>
                    <div className="flex gap-2 flex-wrap">
                      {ex.phases.map((p, pi) => (
                        <span key={pi} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5">
                          {p.label} {p.duration}s
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

  const currentPhase = selected.phases[phaseIdx];
  const cycleProgress = (cycles / targetCycles) * 100;

  return (
    <main className="flex-1 flex flex-col w-full px-6 sm:px-12 lg:px-20">
      <nav className="py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => { setSelected(null); setRunning(false); }} className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Change
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-sm font-medium text-white/70">{selected.emoji} {selected.name}</span>
        </div>
        <button onClick={restart} className="btn-secondary text-xs px-3 py-1.5">↺ Restart</button>
      </nav>

      {/* Progress */}
      <div className="py-4 border-b border-white/5">
        <div className="flex justify-between text-xs text-white/30 mb-2">
          <span>Cycle {Math.min(cycles + (running ? 1 : 0), targetCycles)} of {targetCycles}</span>
          <span>{fmt(totalSeconds)}</span>
        </div>
        <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-1000"
            style={{ width: `${cycleProgress}%` }}
          />
        </div>
      </div>

      {/* Circle */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="relative flex items-center justify-center mb-8" style={{ width: 280, height: 280 }}>
          {/* Outer glow ring */}
          <div
            className="absolute rounded-full transition-all duration-1000"
            style={{
              width: 280 * circleScale,
              height: 280 * circleScale,
              border: `1px solid ${RING_COLOR[selected.color]}`,
              opacity: running ? 0.5 : 0.2,
            }}
          />
          {/* Main circle */}
          <div
            className="rounded-full flex items-center justify-center transition-all duration-1000"
            style={{
              width: 220 * circleScale,
              height: 220 * circleScale,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${RING_COLOR[selected.color]}`,
              boxShadow: running ? GLOW[selected.color] : 'none',
            }}
          >
            <div className="text-center px-4">
              {done ? (
                <>
                  <div className="text-4xl mb-2">✨</div>
                  <div className="text-sm font-semibold text-white/70">Complete</div>
                </>
              ) : !running ? (
                <>
                  <div className="text-4xl mb-2">{selected.emoji}</div>
                  <div className="text-xs text-white/30">{cycles === 0 ? 'Tap Start' : 'Paused'}</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-white/50 mb-1">{currentPhase.label}</div>
                  <div className="text-5xl font-bold text-white leading-none">
                    {currentPhase.duration - phaseSeconds}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Phase indicators */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {selected.phases.map((p, i) => (
            <div
              key={i}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-300 ${
                i === phaseIdx && running
                  ? BADGE_STYLE[selected.color]
                  : 'bg-white/[0.02] border-white/5 text-white/20'
              }`}
            >
              {p.label} {p.duration}s
            </div>
          ))}
        </div>

        {/* Button */}
        {!done ? (
          <button
            onClick={toggleRunning}
            className="btn-primary px-16 py-4 text-base rounded-xl"
          >
            {running ? 'Pause' : cycles === 0 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <div className="text-center fade-up w-full max-w-sm">
            <div className="glass rounded-2xl p-8 text-center glow-green mb-4">
              <div className="text-4xl mb-3">🌿</div>
              <div className="text-xl font-bold text-white mb-1">Session Complete</div>
              <div className="text-sm text-white/40">{targetCycles} cycles · {fmt(totalSeconds)}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={restart} className="btn-primary flex-1 py-3 text-sm rounded-xl">
                Go Again
              </button>
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1 py-3 text-sm rounded-xl">
                Change
              </button>
            </div>
          </div>
        )}

        {!running && !done && cycles === 0 && (
          <p className="text-xs text-white/20 mt-6 text-center">
            Find a comfortable position and focus on your breath
          </p>
        )}
      </div>
    </main>
  );
}
