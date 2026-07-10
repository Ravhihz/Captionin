import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const FREE_DAILY_LIMIT = 5; // sesuaikan angka bisnismu

export async function checkAndConsumeQuota(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  const today = new Date().toISOString().slice(0, 10);
  const key = `quota:${userId}:${today}`;

  const used = await redis.incr(key);
  if (used === 1) {
    await redis.expire(key, 60 * 60 * 24); // reset tiap hari
  }

  return {
    allowed: used <= FREE_DAILY_LIMIT,
    remaining: Math.max(0, FREE_DAILY_LIMIT - used),
  };
}