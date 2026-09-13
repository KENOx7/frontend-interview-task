import confetti from 'canvas-confetti';

export const fireConfetti = () => {
  const colors = ['#c2500f', '#d97706', '#2d7a5a', '#f59e0b', '#10b981'];

  try {
    confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0.2, y: 0.7 }, colors });
    confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 0.8, y: 0.7 }, colors });
  } catch (error) {
    console.error(error);
  }
};