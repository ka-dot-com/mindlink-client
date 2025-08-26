import { DayInputData } from '../types/day';

export function computeNeuroScore(data: DayInputData) {
  let base = 50;
  if (data.sleepHours >= 7) base += 10;
  if (data.steps >= 8000) base += 10;
  if (data.habitsCompleted >= 2) base += 8;
  if (data.stressLevel <= 2) base += 4;
  return Math.min(100, base);
}