export interface UserProfile {
  id?: string;
  createdAt?: string;
  primaryGoal?: PrimaryGoalKey;
  weightKg?: number;
  heightCm?: number;
  birthYear?: number;
  activityLevel?: 'low' | 'moderate' | 'high';
  language?: string;
  customTiles?: string[];
  targets?: UserTargets;
  version?: number;
}

export type PrimaryGoalKey =
  | 'weight_loss'
  | 'muscle_gain'
  | 'stress_reduction'
  | 'sleep_better'
  | 'cycle_balance'
  | 'habit_formation';

export interface UserTargets {
  steps: number;
  waterMl: number;
  calories: number;
  proteinG: number;
}