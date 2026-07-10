import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getHistory } from "@/lib/history";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Harus login" }, { status: 401 });
  }

  const history = await getHistory(session.user.email);
  return NextResponse.json({ history });
}