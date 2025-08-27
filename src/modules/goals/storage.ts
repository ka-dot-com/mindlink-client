import { loadJSON, saveJSON } from '../../core/storage/async';
import { UserProfile, PrimaryGoalKey, UserTargets } from '../user/types';

const USER_PROFILE_KEY = 'user_profile_v1';

export async function loadUserProfile(): Promise<UserProfile> {
  return loadJSON<UserProfile>(USER_PROFILE_KEY, {
    createdAt: new Date().toISOString(),
    version: 1
  });
}

export async function saveUserProfile(profile: UserProfile) {
  await saveJSON(USER_PROFILE_KEY, profile);
}

export function computeTargets(primaryGoal: PrimaryGoalKey, weightKg?: number): UserTargets {
  const stepsBase = 7000;
  const goalMultiplier: Record<PrimaryGoalKey, number> = {
    weight_loss: 1.15,
    muscle_gain: 1.1,
    stress_reduction: 0.9,
    sleep_better: 0.95,
    cycle_balance: 1.0,
    habit_formation: 1.0
  };
  const steps = Math.round(stepsBase * goalMultiplier[primaryGoal]);
  const baseWater = weightKg ? Math.round(weightKg * 35) : 2000;
  const calories =
    primaryGoal === 'weight_loss'
      ? 1800
      : primaryGoal === 'muscle_gain'
      ? 2400
      : 2000;
  const protein =
    primaryGoal === 'muscle_gain'
      ? weightKg
        ? Math.round(weightKg * 1.6)
        : 110
      : primaryGoal === 'weight_loss'
      ? weightKg
        ? Math.round(weightKg * 1.4)
        : 90
      : 80;
  return {
    steps,
    waterMl: baseWater,
    calories,
    proteinG: protein
  };
}