import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const PREMIUM_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 hari

export interface Order {
  merchantOrderId: string;
  userId: string; // email user
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
}

export async function saveOrder(order: Order) {
  await redis.set(`order:${order.merchantOrderId}`, order, { ex: 60 * 60 * 24 * 7 });
}

export async function getOrder(merchantOrderId: string): Promise<Order | null> {
  return (await redis.get<Order>(`order:${merchantOrderId}`)) ?? null;
}

export async function markOrderPaid(merchantOrderId: string) {
  const order = await getOrder(merchantOrderId);
  if (!order) return null;

  order.status = "paid";
  await saveOrder(order);
  await redis.set(`premium:${order.userId}`, true, { ex: PREMIUM_DURATION_SECONDS });
  return order;
}

export async function isPremium(userId: string): Promise<boolean> {
  return Boolean(await redis.get(`premium:${userId}`));
}