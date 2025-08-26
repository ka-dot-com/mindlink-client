export interface DailyFormData {
  sleepHours: string;
  steps: string;
  stressLevel: string;
  habitsCompleted: string;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  form: DailyFormData;
  habits: string[];
  score: number | null;
  updatedAt: string; // ISO timestamp
}