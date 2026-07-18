import { Redis } from "@upstash/redis";
import { isPremium } from "./orders";

const redis = Redis.fromEnv();
const FREE_DAILY_LIMIT = 5; // sesuaikan angka bisnismu
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000; // UTC+7

export async function checkAndConsumeQuota(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  unlimited?: boolean;
}> {
  if (await isPremium(userId)) {
    return { allowed: true, remaining: FREE_DAILY_LIMIT, unlimited: true };
  }

  const todayWIB = new Date(Date.now() + WIB_OFFSET_MS).toISOString().slice(0, 10);
  const key = `quota:${userId}:${todayWIB}`;

  const used = await redis.incr(key);
  if (used === 1) {
    await redis.expire(key, 60 * 60 * 24);
  }

  return {
    allowed: used <= FREE_DAILY_LIMIT,
    remaining: Math.max(0, FREE_DAILY_LIMIT - used),
  };
}