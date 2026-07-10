import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const MAX_HISTORY = 20;

export interface HistoryEntry {
  id: string;
  productName: string;
  platform: string;
  content: string;
  createdAt: string;
}

export async function saveHistoryEntry(userId: string, entry: HistoryEntry) {
  const key = `history:${userId}`;
  const existing = await redis.get<HistoryEntry[]>(key);
  const list = Array.isArray(existing) ? existing : [];
  list.unshift(entry);
  await redis.set(key, list.slice(0, MAX_HISTORY));
}

export async function getHistory(userId: string): Promise<HistoryEntry[]> {
  const key = `history:${userId}`;
  const existing = await redis.get<HistoryEntry[]>(key);
  return Array.isArray(existing) ? existing : [];
}