'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const EXERCISES = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Used by Navy SEALs to stay calm under pressure.',
    emoji: '⬜',
    color: 'blue',
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
    color: 'purple',
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

const COLOR_MAP: Record<string, Record<string, string>> = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    ring: 'ring-blue-300',
    circle: 'bg-blue-100 border-blue-300',
    circleFill: 'bg-blue-200',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white',
    light: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    ring: 'ring-purple-300',
    circle: 'bg-purple-100 border-purple-300',
    circleFill: 'bg-purple-200',
    btn: 'bg-purple-600 hover:bg-purple-700 text-white',
    light: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    ring: 'ring-emerald-300',
    circle: 'bg-emerald-100 border-emerald-300',
    circleFill: 'bg-emerald-200',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    light: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
};

function getPhaseLabel(exercise: Exercise, phaseIdx: number): string {
  return exercise.phases[phaseIdx]?.label ?? '';
}

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

  // Clear on unmount
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
          // Move to next phase
          const nextPhaseIdx = (phaseIdx + 1) % selected.phases.length;
          setPhaseIdx(nextPhaseIdx);

          if (nextPhaseIdx === 0) {
            // Completed a full cycle
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

  // Circle animation: scale based on phase
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
      <main className="min-h-screen flex flex-col max-w-2xl mx-auto px-4">
        <nav className="border-b-2 border-black py-4 flex items-center gap-3">
          <Link href="/" className="text-sm opacity-60 hover:opacity-100 transition-opacity">← Back</Link>
          <span className="opacity-20">|</span>
          <span className="font-black uppercase tracking-widest text-sm">🫁 Just Breathe</span>
        </nav>

        <div className="flex-1 py-8">
          <div className="border-2 border-black mb-6">
            <div className="bg-black text-white px-5 py-2">
              <span className="font-black uppercase tracking-widest text-xs">Choose Technique</span>
            </div>
            <div className="p-5">
              <p className="text-sm opacity-60">Guided breathing to calm your nervous system.</p>
            </div>
          </div>

          <div className="space-y-0">
            {EXERCISES.map((ex, i) => (
              <button
                key={ex.id}
                onClick={() => startExercise(ex)}
                className={`w-full border-2 border-black p-5 text-left hover:bg-black hover:text-white transition-colors group ${i > 0 ? '-mt-[2px]' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{ex.emoji}</div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-widest">{ex.name}</div>
                    <div className="text-xs opacity-50 mt-0.5 mb-2">{ex.description}</div>
                    <div className="flex gap-2 flex-wrap">
                      {ex.phases.map((p, pi) => (
                        <span key={pi} className="text-xs border border-current px-2 py-0.5 opacity-50 group-hover:opacity-80">
                          {p.label} {p.duration}s
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="font-black opacity-30 group-hover:opacity-100 mt-1">→</span>
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
    <main className="min-h-screen flex flex-col max-w-2xl mx-auto px-4">
      <nav className="border-b-2 border-black py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="text-sm opacity-60 hover:opacity-100 transition-opacity">← Change</button>
          <span className="opacity-20">|</span>
          <span className="font-black uppercase tracking-widest text-sm">{selected.emoji} {selected.name}</span>
        </div>
        <button onClick={restart} className="border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">↺ Restart</button>
      </nav>

      {/* Progress */}
      <div className="border-b-2 border-black px-4 py-4">
        <div className="flex justify-between text-xs uppercase tracking-widest opacity-50 mb-2">
          <span>Cycle {Math.min(cycles + (running ? 1 : 0), targetCycles)} of {targetCycles}</span>
          <span>{fmt(totalSeconds)}</span>
        </div>
        <div className="w-full h-1 bg-gray-100 overflow-hidden">
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
            className="absolute border border-black transition-all duration-1000"
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
                  <div className="text-xs uppercase tracking-widest opacity-40">{cycles === 0 ? 'Tap Start' : 'Paused'}</div>
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
              className={`text-xs px-3 py-1.5 border-2 uppercase tracking-widest transition-all ${
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
          >
            {running ? 'Pause' : cycles === 0 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <div className="text-center fade-in w-full max-w-sm">
            <div className="border-2 border-black mb-4">
              <div className="bg-black text-white px-6 py-3 text-center">
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
          <p className="text-xs opacity-30 uppercase tracking-widest mt-6 text-center">
            Find a comfortable position first
          </p>
        )}
      </div>
    </main>
  );
}
