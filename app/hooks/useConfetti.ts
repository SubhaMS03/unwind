'use client';

import confetti from 'canvas-confetti';

export function useConfetti() {
  return {
    burst: () => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C4A8FF', '#82C9A5', '#D4845A', '#5B8DB8', '#7C5CBF'],
        disableForReducedMotion: true,
      });
    },
  };
}
