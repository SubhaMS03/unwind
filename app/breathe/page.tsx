'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useSound } from '@/app/hooks/useSound';

const EXERCISES = [
  { id: 'box', name: 'Box Breathing', description: 'Used by Navy SEALs to stay calm under pressure.', emoji: '⬜', color: '#F47C48', phases: [{ label: 'Inhale', duration: 4 }, { label: 'Hold', duration: 4 }, { label: 'Exhale', duration: 4 }, { label: 'Hold', duration: 4 }] },
  { id: '478', name: '4-7-8 Breathing', description: 'A natural tranquilizer for the nervous system.', emoji: '🌙', color: '#5BB5D5', phases: [{ label: 'Inhale', duration: 4 }, { label: 'Hold', duration: 7 }, { label: 'Exhale', duration: 8 }] },
  { id: 'calm', name: 'Calm Breath', description: 'Simple slow breathing to reduce anxiety.', emoji: '🌊', color: '#6DC29B', phases: [{ label: 'Inhale', duration: 5 }, { label: 'Exhale', duration: 6 }] },
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
  const { playClick, playChime, startAmbient, stopAmbient } = useSound();

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  useEffect(() => {
    if (selected && running) startAmbient();
    else stopAmbient();
    return () => stopAmbient();
  }, [selected, running, startAmbient, stopAmbient]);

  useEffect(() => {
    if (!running || !selected) return;
    timerRef.current = setInterval(() => {
      setPhaseSeconds(prev => {
        const phaseDuration = selected.phases[phaseIdx].duration;
        const next = prev + 1;
        if (next >= phaseDuration) {
          const nextPhaseIdx = (phaseIdx + 1) % selected.phases.length;
          setPhaseIdx(nextPhaseIdx);
          if (nextPhaseIdx === 0) { setCycles(c => { const nc = c + 1; if (nc >= targetCycles) { setRunning(false); setDone(true); playChime(); } return nc; }); }
          setTotalSeconds(s => s + 1); return 0;
        }
        setTotalSeconds(s => s + 1); return next;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, selected, phaseIdx, targetCycles, playChime]);

  const startExercise = (ex: Exercise) => { playClick(); setSelected(ex); setRunning(false); setPhaseIdx(0); setPhaseSeconds(0); setCycles(0); setTotalSeconds(0); setDone(false); };
  const toggleRunning = () => { if (done) return; playClick(); setRunning(r => !r); };
  const restart = () => { playClick(); if (timerRef.current) clearInterval(timerRef.current); setPhaseIdx(0); setPhaseSeconds(0); setCycles(0); setTotalSeconds(0); setDone(false); setRunning(false); };
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
      <main className="flex-1 flex flex-col w-full">
        <nav className="sticky top-0 z-50 bg-[#FEF8F0]/90 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-5 flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-[#A8A29E] hover:text-[#2D2A26] transition-colors">← Back</Link>
            <div className="w-px h-4 bg-[#E8E2D9]" />
            <span className="text-sm font-bold text-[#2D2A26]">Just Breathe</span>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center py-16 sm:py-24">
          <div className="max-w-md w-full px-6">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
              <div className="w-20 h-20 rounded-3xl bg-[#F47C48] flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-[#F47C48]/25">🧘‍♀️</div>
              <h1 className="text-3xl font-extrabold text-[#2D2A26] mb-2">Just Breathe</h1>
              <p className="text-sm text-[#A8A29E]">Guided breathing · 4 cycles per session</p>
            </motion.div>
            <div className="space-y-3">
              {EXERCISES.map((ex, i) => (
                <motion.button
                  key={ex.id}
                  onClick={() => startExercise(ex)}
                  className="w-full rounded-2xl p-5 bg-white shadow-sm hover:shadow-md text-left group transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${ex.color}15` }}>{ex.emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold text-[#2D2A26] mb-0.5">{ex.name}</div>
                      <div className="text-xs text-[#A8A29E] mb-3">{ex.description}</div>
                      <div className="flex gap-1.5 flex-wrap">
                        {ex.phases.map((p, pi) => (
                          <span key={pi} className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-[#A8A29E]" style={{ backgroundColor: `${ex.color}10` }}>{p.label} {p.duration}s</span>
                        ))}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-[#D5D0CA] group-hover:translate-x-0.5 transition-all mt-2" style={{ color: ex.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </motion.button>
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
    <main className="flex-1 flex flex-col w-full">
      <nav className="sticky top-0 z-50 bg-[#FEF8F0]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setSelected(null); setRunning(false); }} className="text-sm font-bold text-[#A8A29E] hover:text-[#2D2A26] transition-colors">← Change</button>
            <div className="w-px h-4 bg-[#E8E2D9]" />
            <span className="text-sm font-bold text-[#2D2A26]">{selected.emoji} {selected.name}</span>
          </div>
          <button onClick={restart} className="text-xs font-bold text-[#A8A29E] hover:text-[#2D2A26] px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all">↺ Restart</button>
        </div>
      </nav>

      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-3">
          <div className="flex justify-between text-xs text-[#A8A29E] font-bold mb-2">
            <span>Cycle {Math.min(cycles + (running ? 1 : 0), targetCycles)} of {targetCycles}</span>
            <span>{fmt(totalSeconds)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F0ECE6] overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: selected.color }} animate={{ width: `${cycleProgress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="relative flex items-center justify-center mb-10" style={{ width: 260, height: 260 }}>
          <motion.div
            className="absolute rounded-full"
            animate={{ width: 260 * circleScale, height: 260 * circleScale, opacity: running ? 0.3 : 0.15 }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            style={{ border: `2px solid ${selected.color}` }}
          />
          <motion.div
            className="rounded-full flex items-center justify-center"
            animate={{ width: 200 * circleScale, height: 200 * circleScale }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            style={{ border: `3px solid ${selected.color}50`, background: `${selected.color}12`, boxShadow: running ? `0 0 80px ${selected.color}20` : 'none' }}
          >
            <div className="text-center">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-3xl mb-1">✨</div>
                    <div className="text-sm font-bold text-[#2D2A26]">Complete</div>
                  </motion.div>
                ) : !running ? (
                  <motion.div key="paused" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-3xl mb-1">{selected.emoji}</div>
                    <div className="text-xs text-[#A8A29E] font-bold">{cycles === 0 ? 'Tap Start' : 'Paused'}</div>
                  </motion.div>
                ) : (
                  <motion.div key={`${phaseIdx}-${phaseSeconds}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    <div className="text-sm font-bold text-[#A8A29E] mb-1">{currentPhase.label}</div>
                    <div className="text-4xl font-extrabold text-[#2D2A26]">{currentPhase.duration - phaseSeconds}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {selected.phases.map((p, i) => (
            <motion.div
              key={i}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${i === phaseIdx && running ? 'text-white' : 'bg-white text-[#A8A29E] shadow-sm'}`}
              style={i === phaseIdx && running ? { backgroundColor: selected.color } : {}}
              animate={{ scale: i === phaseIdx && running ? 1.05 : 1 }}
            >
              {p.label} {p.duration}s
            </motion.div>
          ))}
        </div>

        {!done ? (
          <motion.button
            onClick={toggleRunning}
            className="font-bold px-12 py-3.5 rounded-full text-sm text-white shadow-lg"
            style={{ backgroundColor: selected.color, boxShadow: `0 8px 24px ${selected.color}30` }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {running ? 'Pause' : cycles === 0 ? 'Start' : 'Resume'}
          </motion.button>
        ) : (
          <motion.div
            className="w-full max-w-sm px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="rounded-3xl p-8 text-center mb-4 bg-white shadow-sm">
              <div className="text-3xl mb-2">🌿</div>
              <h2 className="text-xl font-extrabold text-[#2D2A26] mb-1">Session Complete</h2>
              <p className="text-sm text-[#A8A29E]">{targetCycles} cycles · {fmt(totalSeconds)}</p>
            </div>
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={restart} className="flex-1 bg-[#F47C48] text-white font-bold py-3.5 rounded-full text-sm shadow-md shadow-[#F47C48]/25">Go Again</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelected(null)} className="flex-1 bg-white text-[#2D2A26] font-bold py-3.5 rounded-full text-sm shadow-sm">Change</motion.button>
            </div>
          </motion.div>
        )}

        {!running && !done && cycles === 0 && <p className="text-xs text-[#D5D0CA] mt-8 font-medium">Find a comfortable position and focus on your breath</p>}
      </div>
    </main>
  );
}
