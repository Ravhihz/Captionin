import crypto from "crypto";

const MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE!;
const API_KEY = process.env.DUITKU_API_KEY!;

// Ganti ke https://passport.duitku.com/webapi/api/merchant kalau sudah production
const BASE_URL = "https://sandbox.duitku.com/webapi/api/merchant";

function sign(stringToSign: string) {
  return crypto.createHmac("sha256", API_KEY).update(stringToSign).digest("hex");
}

interface CreateTransactionParams {
  merchantOrderId: string;
  paymentAmount: number;
  paymentMethod: string;
  productDetails: string;
  email: string;
  customerVaName: string;
  callbackUrl: string;
  returnUrl: string;
}

interface DuitkuInquiryResponse {
  paymentUrl: string;
  reference: string;
  statusCode: string;
  statusMessage: string;
}

export async function createTransaction(params: CreateTransactionParams) {
  const { merchantOrderId, paymentAmount, paymentMethod, productDetails, email, customerVaName, callbackUrl, returnUrl } = params;

  // Formula Duitku: signature = HMAC_SHA256(merchantCode + merchantOrderId + paymentAmount, apiKey)
  const signature = sign(`${MERCHANT_CODE}${merchantOrderId}${paymentAmount}`);

  const res = await fetch(`${BASE_URL}/v2/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchantCode: MERCHANT_CODE,
      paymentAmount,
      paymentMethod,
      merchantOrderId,
      productDetails,
      email,
      customerVaName,
      callbackUrl,
      returnUrl,
      signature,
      expiryPeriod: 60,
    }),
  });

  const data: DuitkuInquiryResponse = await res.json();
  if (data.statusCode !== "00") {
    throw new Error(data.statusMessage || "Gagal membuat transaksi Duitku");
  }
  return data;
}

export function verifyCallbackSignature(params: {
  merchantCode: string;
  amount: string;
  merchantOrderId: string;
  signature: string;
}) {
  // Formula callback: signature = HMAC_SHA256(merchantCode + amount + merchantOrderId, apiKey)
  const expected = sign(`${params.merchantCode}${params.amount}${params.merchantOrderId}`);
  return expected === params.signature;
}