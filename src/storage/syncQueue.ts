import { loadJSON, saveJSON } from './async';

const QUEUE_KEY = 'sync_queue_v1';

export interface QueueItem {
  type: 'daily_record';
  key: string; // klucz rekordu daily_YYYY-MM-DD
  createdAt: string;
}

export async function addToQueue(item: Omit<QueueItem, 'createdAt'>) {
  const list = await loadJSON<QueueItem[]>(QUEUE_KEY, []);
  list.push({ ...item, createdAt: new Date().toISOString() });
  await saveJSON(QUEUE_KEY, list);
}

export async function getQueue(): Promise<QueueItem[]> {
  return loadJSON<QueueItem[]>(QUEUE_KEY, []);
}

export async function replaceQueue(newList: QueueItem[]) {
  await saveJSON(QUEUE_KEY, newList);
}

// Mock “wysyłki”
export async function mockSync(sendLimit = 10): Promise<number> {
  const list = await getQueue();
  if (list.length === 0) return 0;
  const slice = list.slice(0, sendLimit);
  // Tu normalnie: fetch(BASE_API_URL + '/sync', {body: ...})
  // My tylko “udajemy”, że się udało:
  const remaining = list.slice(slice.length);
  await replaceQueue(remaining);
  return slice.length;
}