import { loadJSON, saveJSON } from './async';
import { DailyRecord, DailyFormData } from '../types/dailyRecord';
import { todayISO, makeDailyKey } from '../lib/date';

const DEFAULT_FORM: DailyFormData = {
  sleepHours: '7',
  steps: '5000',
  stressLevel: '3',
  habitsCompleted: '0',
};

export async function loadToday(): Promise<DailyRecord> {
  const date = todayISO();
  const key = makeDailyKey(date);
  const rec = await loadJSON<DailyRecord | null>(key, null);
  if (rec) return rec;
  // create new
  const fresh: DailyRecord = {
    date,
    form: { ...DEFAULT_FORM },
    habits: [],
    score: null,
    updatedAt: new Date().toISOString(),
  };
  await saveJSON(key, fresh);
  return fresh;
}

export async function saveDaily(record: DailyRecord): Promise<void> {
  const key = makeDailyKey(record.date);
  record.updatedAt = new Date().toISOString();
  await saveJSON(key, record);
}

// Migration from old keys (one-time best effort)
const OLD_FORM_KEY = 'day_form_v1';
const OLD_HABITS_KEY = 'habits_completed_v1';

export async function migrateIfNeeded(): Promise<void> {
  try {
    // Try loading old data
    const oldForm = await loadJSON<any>(OLD_FORM_KEY, null);
    const oldHabits = await loadJSON<string[]>(OLD_HABITS_KEY, null);
    if (!oldForm && !oldHabits) return; // nothing to migrate

    const today = await loadToday();
    // Merge only if today still default
    if (today.habits.length === 0 && oldHabits) {
      today.habits = oldHabits;
    }
    if (today.form.sleepHours === '7' && oldForm && oldForm.sleepHours) {
      today.form = {
        sleepHours: oldForm.sleepHours ?? '7',
        steps: oldForm.steps ?? '5000',
        stressLevel: oldForm.stressLevel ?? '3',
        habitsCompleted: oldForm.habitsCompleted ?? '0',
      };
    }
    await saveDaily(today);
    // We do NOT delete old keys (safe), można by dodać cleanup
  } catch (e) {
    console.warn('migrateIfNeeded error', e);
  }
}