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
      <main className="min-h-screen flex flex-col max-w-xl mx-auto px-5">
        <nav className="py-5 flex items-center gap-3 border-b border-gray-200">
          <Link href="/" className="text-gray-400 hover:text-gray-700 text-sm">← Back</Link>
          <span className="text-gray-200">|</span>
          <span className="font-bold">🫁 Just Breathe</span>
        </nav>
        <div className="flex-1 py-10">
          <h1 className="text-3xl font-bold mb-2">Just Breathe</h1>
          <p className="text-gray-400 text-sm mb-8">Choose a breathing technique. Your body will thank you.</p>
          <div className="space-y-4">
            {EXERCISES.map(ex => {
              const c = COLOR_MAP[ex.color];
              return (
                <button
                  key={ex.id}
                  onClick={() => startExercise(ex)}
                  className={`w-full border rounded-2xl p-5 text-left hover:shadow-md transition-all ${c.border} hover:${c.bg}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{ex.emoji}</div>
                    <div className="flex-1">
                      <div className={`font-bold text-lg ${c.text}`}>{ex.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{ex.description}</div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {ex.phases.map((p, i) => (
                          <span key={i} className={`text-xs border px-2 py-0.5 rounded-full ${c.light}`}>
                            {p.label} {p.duration}s
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  const c = COLOR_MAP[selected.color];
  const currentPhase = selected.phases[phaseIdx];
  const phaseProgress = phaseSeconds / currentPhase.duration;
  const cycleProgress = (cycles / targetCycles) * 100;

  return (
    <main className="min-h-screen flex flex-col max-w-xl mx-auto px-5">
      <nav className="py-5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-sm">← Change</button>
          <span className="text-gray-200">|</span>
          <span className={`font-bold text-sm ${c.text}`}>{selected.emoji} {selected.name}</span>
        </div>
        <button onClick={restart} className="mono text-xs border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50">
          Restart
        </button>
      </nav>

      <div className="flex-1 py-8 flex flex-col items-center">

        {/* Cycle progress */}
        <div className="w-full mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Cycle {Math.min(cycles + (running ? 1 : 0), targetCycles)} of {targetCycles}</span>
            <span>{fmt(totalSeconds)}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${c.circleFill}`}
              style={{ width: `${cycleProgress}%` }}
            />
          </div>
        </div>

        {/* Breathing circle */}
        <div className="relative flex items-center justify-center mb-8" style={{ width: 240, height: 240 }}>
          {/* Outer ring pulse */}
          <div
            className={`absolute rounded-full border-2 ${c.border} transition-all duration-1000`}
            style={{
              width: 240 * circleScale,
              height: 240 * circleScale,
              opacity: running ? 0.3 : 0.15,
            }}
          />
          {/* Main circle */}
          <div
            className={`rounded-full border-2 flex items-center justify-center transition-all duration-1000 ${c.circle}`}
            style={{
              width: 200 * circleScale,
              height: 200 * circleScale,
            }}
          >
            <div className="text-center">
              {done ? (
                <>
                  <div className="text-4xl mb-1">✨</div>
                  <div className={`text-sm font-bold ${c.text}`}>Done!</div>
                </>
              ) : !running ? (
                <>
                  <div className="text-4xl mb-1">{selected.emoji}</div>
                  <div className="text-xs text-gray-400">{cycles === 0 ? 'Ready' : 'Paused'}</div>
                </>
              ) : (
                <>
                  <div className={`text-xl font-bold ${c.text}`}>{currentPhase.label}</div>
                  <div className="text-3xl font-light text-gray-700 mt-1">
                    {currentPhase.duration - phaseSeconds}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Phase indicators */}
        <div className="flex gap-2 mb-10 flex-wrap justify-center">
          {selected.phases.map((p, i) => (
            <div
              key={i}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                i === phaseIdx && running
                  ? `${c.light} font-bold`
                  : 'border-gray-200 text-gray-400'
              }`}
            >
              {p.label} · {p.duration}s
            </div>
          ))}
        </div>

        {/* Controls */}
        {!done ? (
          <button
            onClick={toggleRunning}
            className={`px-10 py-3 rounded-full text-base font-semibold transition-all ${c.btn}`}
          >
            {running ? 'Pause' : cycles === 0 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <div className="text-center fade-in">
            <div className={`border rounded-2xl p-6 mb-4 ${c.border} ${c.bg}`}>
              <div className="text-3xl mb-2">🌿</div>
              <div className={`font-bold text-lg ${c.text} mb-1`}>Session Complete</div>
              <div className="text-sm text-gray-500">{targetCycles} cycles · {fmt(totalSeconds)}</div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={restart}
                className={`border px-5 py-2 rounded-full text-sm font-medium ${c.light}`}
              >
                Go Again
              </button>
              <button
                onClick={() => setSelected(null)}
                className="border border-gray-200 px-5 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-50"
              >
                Change Technique
              </button>
            </div>
          </div>
        )}

        {/* Tip */}
        {!running && !done && cycles === 0 && (
          <p className="text-xs text-gray-400 text-center mt-6 max-w-xs">
            Find a comfortable position. You can close your eyes once you start.
          </p>
        )}
      </div>
    </main>
  );
}
