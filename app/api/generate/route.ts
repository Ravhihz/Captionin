import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { buildPrompt } from "@/lib/prompts";
import { checkAndConsumeQuota } from "@/lib/ratelimit";
import { generateContent } from "@/lib/ai";
import { saveHistoryEntry } from "@/lib/history";

const MAX_FIELD_LENGTH = 500;
const VALID_PLATFORMS = ["instagram", "shopee", "tiktok", "whatsapp"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Harus login" }, { status: 401 });
  }

  let body: {
    productName?: string;
    description?: string;
    targetMarket?: string;
    platform?: string;
    tone?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid" }, { status: 400 });
  }

  const { productName, description, targetMarket, platform, tone } = body;

  if (!productName?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "Nama produk dan deskripsi wajib diisi" }, { status: 400 });
  }
  if (!platform || !VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: "Platform tidak valid" }, { status: 400 });
  }
  if (
    productName.length > MAX_FIELD_LENGTH ||
    description.length > MAX_FIELD_LENGTH ||
    (targetMarket && targetMarket.length > MAX_FIELD_LENGTH)
  ) {
    return NextResponse.json(
      { error: `Input maksimal ${MAX_FIELD_LENGTH} karakter` },
      { status: 400 }
    );
  }

  const quota = await checkAndConsumeQuota(session.user.email);
  if (!quota.allowed) {
    return NextResponse.json(
      { error: "Kuota harian habis. Upgrade ke premium untuk unlimited." },
      { status: 429 }
    );
  }

  try {
    const { systemPrompt, userPrompt } = buildPrompt({
      productName,
      description,
      targetMarket,
      platform,
      tone,
    });
    const content = await generateContent(systemPrompt, userPrompt);

    if (!content.trim()) {
      return NextResponse.json(
        { error: "AI tidak menghasilkan konten, coba generate ulang." },
        { status: 502 }
      );
    }
    await saveHistoryEntry(session.user.email, {
      id: crypto.randomUUID(),
      productName,
      platform,
      content,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ content, remaining: quota.remaining, unlimited: quota.unlimited });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Gagal membuat konten, coba lagi sebentar lagi." },
      { status: 500 }
    );
  }
}