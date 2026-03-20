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
      <div className="min-h-screen w-full flex flex-col items-center">
        <div className="w-full max-w-lg px-6">
          <nav className="py-5 flex items-center gap-3 border-b border-gray-100">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-800 transition-colors">← Back</Link>
            <span className="text-gray-200">|</span>
            <span className="font-semibold text-sm">🫁 Just Breathe</span>
          </nav>
          <div className="pt-10 pb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Just Breathe</h1>
            <p className="text-gray-400 text-sm">Choose a breathing technique. Your body will thank you.</p>
          </div>
          <div className="space-y-2 pb-10">
            {EXERCISES.map(ex => (
              <button
                key={ex.id}
                onClick={() => startExercise(ex)}
                className="w-full border border-gray-100 rounded-xl p-4 text-left hover:border-gray-300 hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl w-10 flex-shrink-0">{ex.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{ex.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 mb-2">{ex.description}</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {ex.phases.map((p, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {p.label} {p.duration}s
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-600 transition-colors">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentPhase = selected.phases[phaseIdx];
  const cycleProgress = (cycles / targetCycles) * 100;

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-lg px-6">
        <nav className="py-5 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="text-sm text-gray-400 hover:text-gray-800 transition-colors">← Change</button>
            <span className="text-gray-200">|</span>
            <span className="font-semibold text-sm">{selected.emoji} {selected.name}</span>
          </div>
          <button onClick={restart} className="text-xs border border-gray-200 px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors">↺ Restart</button>
        </nav>

        {/* Progress bar */}
        <div className="py-5 border-b border-gray-100">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Cycle {Math.min(cycles + (running ? 1 : 0), targetCycles)} of {targetCycles}</span>
            <span>{fmt(totalSeconds)}</span>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-1000"
              style={{ width: `${cycleProgress}%` }}
            />
          </div>
        </div>

        {/* Breathing circle */}
        <div className="flex justify-center py-12">
          <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
            {/* Outer ring */}
            <div
              className="absolute rounded-full border border-gray-200 transition-all duration-1000"
              style={{ width: 260 * circleScale, height: 260 * circleScale, opacity: running ? 0.6 : 0.3 }}
            />
            {/* Main circle */}
            <div
              className="rounded-full border-2 border-gray-900 flex items-center justify-center transition-all duration-1000 bg-white"
              style={{ width: 210 * circleScale, height: 210 * circleScale }}
            >
              <div className="text-center px-4">
                {done ? (
                  <>
                    <div className="text-4xl mb-2">✨</div>
                    <div className="text-sm font-bold text-gray-800">Done!</div>
                  </>
                ) : !running ? (
                  <>
                    <div className="text-4xl mb-2">{selected.emoji}</div>
                    <div className="text-xs text-gray-400">{cycles === 0 ? 'Tap Start' : 'Paused'}</div>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-bold text-gray-900">{currentPhase.label}</div>
                    <div className="text-5xl font-light text-gray-700 mt-1 leading-none">
                      {currentPhase.duration - phaseSeconds}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Phase pills */}
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          {selected.phases.map((p, i) => (
            <div
              key={i}
              className={`text-xs px-3 py-1.5 rounded-full transition-all border ${
                i === phaseIdx && running
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-400'
              }`}
            >
              {p.label} · {p.duration}s
            </div>
          ))}
        </div>

        {/* Button */}
        {!done ? (
          <div className="flex justify-center pb-10">
            <button
              onClick={toggleRunning}
              className="bg-black text-white px-12 py-3.5 rounded-full text-base font-semibold hover:bg-gray-800 transition-colors"
            >
              {running ? 'Pause' : cycles === 0 ? 'Start' : 'Resume'}
            </button>
          </div>
        ) : (
          <div className="text-center fade-in pb-10">
            <div className="border border-gray-200 rounded-2xl p-6 mb-4">
              <div className="text-3xl mb-2">🌿</div>
              <div className="font-extrabold text-xl mb-1">Session Complete</div>
              <div className="text-sm text-gray-400">{targetCycles} cycles · {fmt(totalSeconds)}</div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={restart} className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                Go Again
              </button>
              <button onClick={() => setSelected(null)} className="border border-gray-200 px-6 py-2.5 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Change Technique
              </button>
            </div>
          </div>
        )}

        {!running && !done && cycles === 0 && (
          <p className="text-xs text-gray-300 text-center pb-8">
            Find a comfortable position. You can close your eyes once you start.
          </p>
        )}
      </div>
    </div>
  );
}
