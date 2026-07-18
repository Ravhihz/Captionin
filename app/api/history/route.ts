import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getHistory } from "@/lib/history";
import { isPremium } from "@/lib/orders";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Harus login" }, { status: 401 });
  }

  const [history, premium] = await Promise.all([
    getHistory(session.user.email),
    isPremium(session.user.email),
  ]);

  return NextResponse.json({ history, premium });
}