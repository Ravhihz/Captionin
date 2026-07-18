import { NextRequest, NextResponse } from "next/server";
import { verifyCallbackSignature } from "@/lib/duitku";
import { getOrder, markOrderPaid } from "@/lib/orders";

// Duitku ngirim callback sebagai x-www-form-urlencoded, bukan JSON
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const merchantCode = form.get("merchantCode")?.toString() ?? "";
  const amount = form.get("amount")?.toString() ?? "";
  const merchantOrderId = form.get("merchantOrderId")?.toString() ?? "";
  const resultCode = form.get("resultCode")?.toString() ?? "";
  const signature = form.get("signature")?.toString() ?? "";

  if (!merchantCode || !amount || !merchantOrderId || !signature) {
    return NextResponse.json({ error: "Bad Parameter" }, { status: 400 });
  }

  const valid = verifyCallbackSignature({ merchantCode, amount, merchantOrderId, signature });
  if (!valid) {
    return NextResponse.json({ error: "Bad Signature" }, { status: 401 });
  }

  const order = await getOrder(merchantOrderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // resultCode "00" = sukses, sesuai dokumentasi Duitku
  if (resultCode === "00") {
    await markOrderPaid(merchantOrderId);
  }

  return NextResponse.json({ received: true });
}