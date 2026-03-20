'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const EXERCISES = [
  { id: 'box', name: 'Box Breathing', description: 'Used by Navy SEALs to stay calm under pressure.', emoji: '⬜', color: '#7C5CBF', phases: [{ label: 'Inhale', duration: 4 }, { label: 'Hold', duration: 4 }, { label: 'Exhale', duration: 4 }, { label: 'Hold', duration: 4 }] },
  { id: '478', name: '4-7-8 Breathing', description: 'A natural tranquilizer for the nervous system.', emoji: '🌙', color: '#5B8DB8', phases: [{ label: 'Inhale', duration: 4 }, { label: 'Hold', duration: 7 }, { label: 'Exhale', duration: 8 }] },
  { id: 'calm', name: 'Calm Breath', description: 'Simple slow breathing to reduce anxiety.', emoji: '🌊', color: '#5BA87C', phases: [{ label: 'Inhale', duration: 5 }, { label: 'Exhale', duration: 6 }] },
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

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  useEffect(() => {
    if (!running || !selected) return;
    timerRef.current = setInterval(() => {
      setPhaseSeconds(prev => {
        const phaseDuration = selected.phases[phaseIdx].duration;
        const next = prev + 1;
        if (next >= phaseDuration) {
          const nextPhaseIdx = (phaseIdx + 1) % selected.phases.length;
          setPhaseIdx(nextPhaseIdx);
          if (nextPhaseIdx === 0) { setCycles(c => { const nc = c + 1; if (nc >= targetCycles) { setRunning(false); setDone(true); } return nc; }); }
          setTotalSeconds(s => s + 1); return 0;
        }
        setTotalSeconds(s => s + 1); return next;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, selected, phaseIdx, targetCycles]);

  const startExercise = (ex: Exercise) => { setSelected(ex); setRunning(false); setPhaseIdx(0); setPhaseSeconds(0); setCycles(0); setTotalSeconds(0); setDone(false); };
  const toggleRunning = () => { if (done) return; setRunning(r => !r); };
  const restart = () => { if (timerRef.current) clearInterval(timerRef.current); setPhaseIdx(0); setPhaseSeconds(0); setCycles(0); setTotalSeconds(0); setDone(false); setRunning(false); };
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

  if (!selected) {
    return (
      <main className="flex-1 flex flex-col w-full relative overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#7C5CBF]/15 blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#5B8DB8]/10 blur-[100px]" />
        </div>
        <nav className="sticky top-0 z-50 bg-[#0F0B15]/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-white/40 hover:text-white transition-colors">← Back</Link>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-sm font-semibold text-white">Just Breathe</span>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center py-16 relative z-10">
          <div className="max-w-md w-full px-6">
            <div className="text-center mb-10">
              <div className="text-5xl mb-5">🧘‍♀️</div>
              <h1 className="text-3xl font-bold text-white mb-2">Just Breathe</h1>
              <p className="text-sm text-white/40">Guided breathing · 4 cycles per session</p>
            </div>
            <div className="space-y-3">
              {EXERCISES.map((ex) => (
                <button key={ex.id} onClick={() => startExercise(ex)} className="w-full rounded-2xl p-5 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-left group transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/[0.06]">{ex.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-0.5">{ex.name}</div>
                      <div className="text-xs text-white/35 mb-3">{ex.description}</div>
                      <div className="flex gap-1.5 flex-wrap">
                        {ex.phases.map((p, pi) => (
                          <span key={pi} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.06] text-white/40">{p.label} {p.duration}s</span>
                        ))}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-white/20 group-hover:text-[#C4A8FF] group-hover:translate-x-0.5 transition-all mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const currentPhase = selected.phases[phaseIdx];
  const cycleProgress = (cycles / targetCycles) * 100;

  return (
    <main className="flex-1 flex flex-col w-full relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full blur-[120px] transition-all duration-1000" style={{ backgroundColor: `${selected.color}20` }} />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#D4845A]/8 blur-[100px]" />
      </div>
      <nav className="sticky top-0 z-50 bg-[#0F0B15]/70 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setSelected(null); setRunning(false); }} className="text-sm font-medium text-white/40 hover:text-white transition-colors">← Change</button>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-sm font-semibold text-white">{selected.emoji} {selected.name}</span>
          </div>
          <button onClick={restart} className="text-xs font-medium text-white/40 hover:text-white px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] transition-all">↺ Restart</button>
        </div>
      </nav>

      {/* Progress */}
      <div className="border-b border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex justify-between text-xs text-white/35 mb-2">
            <span>Cycle {Math.min(cycles + (running ? 1 : 0), targetCycles)} of {targetCycles}</span>
            <span>{fmt(totalSeconds)}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${cycleProgress}%`, backgroundColor: selected.color }} />
          </div>
        </div>
      </div>

      {/* Circle */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 relative z-10">
        <div className="relative flex items-center justify-center mb-8" style={{ width: 260, height: 260 }}>
          <div className="absolute rounded-full transition-all duration-1000" style={{ width: 260 * circleScale, height: 260 * circleScale, border: `1px solid ${selected.color}30`, opacity: running ? 0.5 : 0.2 }} />
          <div className="rounded-full flex items-center justify-center transition-all duration-1000" style={{ width: 200 * circleScale, height: 200 * circleScale, border: `2px solid ${selected.color}40`, background: `${selected.color}08`, boxShadow: running ? `0 0 60px ${selected.color}20` : 'none' }}>
            <div className="text-center">
              {done ? (<><div className="text-3xl mb-1">✨</div><div className="text-sm font-semibold text-white">Complete</div></>) :
               !running ? (<><div className="text-3xl mb-1">{selected.emoji}</div><div className="text-xs text-white/40">{cycles === 0 ? 'Tap Start' : 'Paused'}</div></>) :
               (<><div className="text-sm font-medium text-white/50 mb-1">{currentPhase.label}</div><div className="text-4xl font-bold text-white">{currentPhase.duration - phaseSeconds}</div></>)}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {selected.phases.map((p, i) => (
            <div key={i} className={`text-xs px-3 py-1.5 rounded-full transition-all ${i === phaseIdx && running ? 'text-white' : 'bg-white/[0.06] text-white/40'}`} style={i === phaseIdx && running ? { backgroundColor: selected.color } : {}}>
              {p.label} {p.duration}s
            </div>
          ))}
        </div>

        {!done ? (
          <button onClick={toggleRunning} className="font-semibold px-12 py-3 rounded-full text-sm text-white transition-all hover:shadow-lg" style={{ backgroundColor: selected.color, boxShadow: `0 0 30px ${selected.color}30` }}>
            {running ? 'Pause' : cycles === 0 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <div className="fade-up w-full max-w-sm px-6">
            <div className="rounded-2xl p-8 text-center mb-4 bg-white/[0.04] backdrop-blur-md border border-white/[0.08]">
              <div className="text-3xl mb-2">🌿</div>
              <h2 className="text-xl font-bold text-white mb-1">Session Complete</h2>
              <p className="text-sm text-white/40">{targetCycles} cycles · {fmt(totalSeconds)}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={restart} className="flex-1 bg-[#7C5CBF] text-white font-semibold py-3 rounded-full text-sm hover:bg-[#6A4DAD] transition-colors">Go Again</button>
              <button onClick={() => setSelected(null)} className="flex-1 bg-white/[0.06] text-white font-semibold py-3 rounded-full text-sm hover:bg-white/[0.1] border border-white/[0.06] transition-colors">Change</button>
            </div>
          </div>
        )}

        {!running && !done && cycles === 0 && <p className="text-xs text-white/20 mt-6">Find a comfortable position and focus on your breath</p>}
      </div>
    </main>
  );
}
