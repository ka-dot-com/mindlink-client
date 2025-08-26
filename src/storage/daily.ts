import { loadJSON, saveJSON } from './async';
import { DailyRecord, DailyFormData } from '../types/dailyRecord';
import { todayISO, makeDailyKey } from '../lib/date';
import { addToQueue } from './syncQueue';

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
  const fresh: DailyRecord = {
    date,
    form: { ...DEFAULT_FORM },
    habits: [],
    score: null,
    updatedAt: new Date().toISOString(),
  };
  await saveJSON(key, fresh);
  // dodaj do kolejki (nowy dzień)
  await addToQueue({ type: 'daily_record', key });
  return fresh;
}

export async function saveDaily(record: DailyRecord): Promise<void> {
  const key = makeDailyKey(record.date);
  record.updatedAt = new Date().toISOString();
  await saveJSON(key, record);
  // Każda aktualizacja – zapewnij, że jest w kolejce (nie robimy duplikatów)
  // Proste podejście: kolejka może mieć duplikaty – backend i tak weźmie najnowszy; można by deduplikować – TODO
  await addToQueue({ type: 'daily_record', key });
}

// Migration from old keys
const OLD_FORM_KEY = 'day_form_v1';
const OLD_HABITS_KEY = 'habits_completed_v1';

export async function migrateIfNeeded(): Promise<void> {
  try {
    const oldForm = await loadJSON<any>(OLD_FORM_KEY, null);
    const oldHabits = await loadJSON<string[]>(OLD_HABITS_KEY, null);
    if (!oldForm && !oldHabits) return;

    const today = await loadToday();
    let changed = false;

    if (today.habits.length === 0 && oldHabits) {
      today.habits = oldHabits;
      today.form.habitsCompleted = String(oldHabits.length);
      changed = true;
    }
    if (oldForm && oldForm.sleepHours) {
      today.form = {
        sleepHours: oldForm.sleepHours ?? '7',
        steps: oldForm.steps ?? '5000',
        stressLevel: oldForm.stressLevel ?? '3',
        habitsCompleted: oldForm.habitsCompleted ?? today.form.habitsCompleted,
      };
      changed = true;
    }
    if (changed) {
      await saveDaily(today);
    }
  } catch (e) {
    console.warn('migrateIfNeeded error', e);
  }
}