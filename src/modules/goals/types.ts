import { PrimaryGoalKey, UserTargets } from '../user/types';

export interface GoalComputationInput {
  primaryGoal: PrimaryGoalKey;
  weightKg?: number;
  heightCm?: number;
  activityLevel?: 'low' | 'moderate' | 'high';
}

export interface GoalResult {
  targets: UserTargets;
}