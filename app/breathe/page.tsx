'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const EXERCISES = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Used by Navy SEALs to stay calm under pressure.',
    emoji: '⬜',
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
    phases: [
      { label: 'Inhale', duration: 5 },
      { label: 'Exhale', duration: 6 },
    ],
  },
];

type Exercise = typeof EXERCISES[0];

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
      <main className="flex-1 flex flex-col w-full px-6 sm:px-12 lg:px-24">
        <nav className="border-b-2 border-black py-5 flex items-center gap-3">
          <Link href="/" className="text-sm opacity-60 hover:opacity-100 transition-opacity font-black uppercase tracking-widest">← Back</Link>
          <span className="opacity-20">|</span>
          <span className="font-black uppercase tracking-widest text-sm">🫁 Just Breathe</span>
        </nav>

        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="border-2 border-black mb-6" style={{ boxShadow: '4px 4px 0 #000' }}>
            <div className="bg-black text-white px-5 py-3">
              <span className="font-black uppercase tracking-widest text-xs">Choose Technique</span>
            </div>
            <div className="p-5">
              <p className="text-sm opacity-60">Guided breathing to calm your nervous system. 4 cycles per session.</p>
            </div>
          </div>

          <div>
            {EXERCISES.map((ex, i) => (
              <button
                key={ex.id}
                onClick={() => startExercise(ex)}
                className={`w-full border-2 border-black p-5 text-left hover:bg-black hover:text-white transition-colors group ${i > 0 ? '-mt-[2px]' : ''}`}
                style={{ boxShadow: i === EXERCISES.length - 1 ? '4px 4px 0 #000' : undefined }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{ex.emoji}</div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-widest text-base">{ex.name}</div>
                    <div className="text-xs opacity-50 mt-0.5 mb-2">{ex.description}</div>
                    <div className="flex gap-2 flex-wrap">
                      {ex.phases.map((p, pi) => (
                        <span key={pi} className="text-xs border border-current px-2 py-0.5 opacity-50 group-hover:opacity-80">
                          {p.label} {p.duration}s
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="font-black opacity-30 group-hover:opacity-100 mt-1 text-lg">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <footer className="border-t-2 border-black py-5 flex items-center justify-between">
          <span className="font-black uppercase tracking-widest text-sm">[ UNWIND ]</span>
          <span className="text-xs opacity-40">Just Breathe</span>
        </footer>
      </main>
    );
  }

  const currentPhase = selected.phases[phaseIdx];
  const cycleProgress = (cycles / targetCycles) * 100;

  return (
    <main className="flex-1 flex flex-col w-full px-6 sm:px-12 lg:px-24">
      <nav className="border-b-2 border-black py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelected(null); setRunning(false); }} className="text-sm opacity-60 hover:opacity-100 transition-opacity font-black uppercase tracking-widest">← Change</button>
          <span className="opacity-20">|</span>
          <span className="font-black uppercase tracking-widest text-sm">{selected.emoji} {selected.name}</span>
        </div>
        <button onClick={restart} className="border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">↺ Restart</button>
      </nav>

      {/* Progress */}
      <div className="border-b-2 border-black px-4 py-4">
        <div className="flex justify-between text-xs uppercase tracking-widest opacity-50 mb-2 font-black">
          <span>Cycle {Math.min(cycles + (running ? 1 : 0), targetCycles)} of {targetCycles}</span>
          <span>{fmt(totalSeconds)}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 overflow-hidden border border-black">
          <div
            className="h-full bg-black transition-all duration-1000"
            style={{ width: `${cycleProgress}%` }}
          />
        </div>
      </div>

      {/* Circle */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="relative flex items-center justify-center mb-8" style={{ width: 260, height: 260 }}>
          {/* Outer ring */}
          <div
            className="absolute border-2 border-black transition-all duration-1000"
            style={{
              width: 260 * circleScale,
              height: 260 * circleScale,
              borderRadius: '50%',
              opacity: running ? 0.15 : 0.08,
            }}
          />
          {/* Main circle */}
          <div
            className="border-2 border-black flex items-center justify-center transition-all duration-1000 bg-white"
            style={{ width: 210 * circleScale, height: 210 * circleScale, borderRadius: '50%' }}
          >
            <div className="text-center px-4">
              {done ? (
                <>
                  <div className="text-4xl mb-2">✨</div>
                  <div className="font-black text-sm uppercase tracking-widest">Done!</div>
                </>
              ) : !running ? (
                <>
                  <div className="text-4xl mb-2">{selected.emoji}</div>
                  <div className="text-xs uppercase tracking-widest opacity-40 font-black">{cycles === 0 ? 'Tap Start' : 'Paused'}</div>
                </>
              ) : (
                <>
                  <div className="font-black text-lg uppercase tracking-widest">{currentPhase.label}</div>
                  <div className="font-black text-6xl leading-none mt-1">
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
              className={`text-xs px-3 py-1.5 border-2 uppercase tracking-widest font-black transition-all ${
                i === phaseIdx && running
                  ? 'bg-black text-white border-black'
                  : 'border-black opacity-20'
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
            className="bg-black text-white border-2 border-black px-16 py-4 font-black uppercase tracking-widest text-base hover:bg-white hover:text-black transition-colors"
            style={{ boxShadow: '4px 4px 0 #000' }}
          >
            {running ? 'Pause' : cycles === 0 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <div className="text-center fade-in w-full max-w-sm">
            <div className="border-2 border-black mb-4" style={{ boxShadow: '4px 4px 0 #000' }}>
              <div className="bg-black text-white px-6 py-4 text-center">
                <div className="text-3xl mb-1">🌿</div>
                <div className="font-black uppercase tracking-widest">Session Complete</div>
                <div className="text-xs opacity-60 mt-1">{targetCycles} cycles · {fmt(totalSeconds)}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={restart} className="flex-1 bg-black text-white border-2 border-black py-3 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors">
                Go Again
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 border-2 border-black py-3 font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
                Change
              </button>
            </div>
          </div>
        )}

        {!running && !done && cycles === 0 && (
          <p className="text-xs opacity-30 uppercase tracking-widest mt-6 text-center font-black">
            Find a comfortable position first
          </p>
        )}
      </div>
    </main>
  );
}
