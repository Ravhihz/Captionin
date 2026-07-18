import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createTransaction } from "@/lib/duitku";
import { saveOrder } from "@/lib/orders";

const PREMIUM_PRICE = 49000;
// Kode metode yang bisa dites langsung di sandbox tanpa app pihak ketiga
// BC = BCA VA, M2 = Mandiri VA, BR = BRI VA, GQ = QRIS Gudang Voucher
const VALID_METHODS = ["BC", "M2", "BR", "GQ"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }

  let body: { paymentMethod?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid" }, { status: 400 });
  }

  if (!body.paymentMethod || !VALID_METHODS.includes(body.paymentMethod)) {
    return NextResponse.json({ error: "Metode pembayaran tidak valid" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  const merchantOrderId = `CPTN-${Date.now()}`;

  try {
    const trx = await createTransaction({
      merchantOrderId,
      paymentAmount: PREMIUM_PRICE,
      paymentMethod: body.paymentMethod,
      productDetails: "Captionin Premium - akses generate tanpa batas 30 hari",
      email: session.user.email,
      customerVaName: session.user.name || "Captionin User",
      callbackUrl: `${baseUrl}/api/duitku/callback`,
      returnUrl: `${baseUrl}/payment/return`,
    });

    await saveOrder({
      merchantOrderId,
      userId: session.user.email,
      amount: PREMIUM_PRICE,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ paymentUrl: trx.paymentUrl });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal memulai pembayaran" },
      { status: 500 }
    );
  }
}