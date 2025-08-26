export function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function makeDailyKey(date: string) {
  return `daily_${date}`;
}