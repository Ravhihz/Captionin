import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { buildPrompt } from "@/lib/prompts";
import { checkAndConsumeQuota } from "@/lib/ratelimit";
// import { generateContent } from "@/lib/anthropic";
import { generateContent } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Harus login" }, { status: 401 });
  }

  const quota = await checkAndConsumeQuota(session.user.email);
  if (!quota.allowed) {
    return NextResponse.json(
      { error: "Kuota harian habis. Upgrade ke premium untuk unlimited." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const prompt = buildPrompt(body);
  const content = await generateContent(prompt);

  return NextResponse.json({ content, remaining: quota.remaining });
}