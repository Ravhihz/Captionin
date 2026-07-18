"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ReturnContent() {
  const params = useSearchParams();
  const resultCode = params.get("resultCode");
  const merchantOrderId = params.get("merchantOrderId");

  const isSuccess = resultCode === "00";
  const isCanceled = resultCode === "02";

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--color-bg)" }}>
      <div
        className="max-w-md w-full text-center space-y-4 rounded-2xl p-8 border-2"
        style={{ borderColor: "var(--color-sand)", backgroundColor: "white" }}
      >
        <div className="text-4xl">{isSuccess ? "✅" : isCanceled ? "❌" : "⏳"}</div>
        <h1 className="font-display font-bold text-xl" style={{ color: "var(--color-ink)" }}>
          {isSuccess ? "Pembayaran berhasil!" : isCanceled ? "Pembayaran dibatalkan" : "Menunggu konfirmasi pembayaran"}
        </h1>
        <p className="opacity-70 text-sm">
          {isSuccess
            ? "Akun kamu sudah upgrade ke Premium. Selamat generate konten tanpa batas!"
            : isCanceled
            ? "Transaksi dibatalkan, kamu bisa coba lagi kapan saja."
            : "Status pembayaran masih diproses. Cek lagi dalam beberapa menit."}
        </p>
        {merchantOrderId && <p className="text-xs opacity-40">ID Transaksi: {merchantOrderId}</p>}
        <Link
          href="/"
          className="inline-block px-5 py-2 rounded-full font-semibold text-white transition-all hover:brightness-110"
          style={{ backgroundColor: "var(--color-pandan)" }}
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={null}>
      <ReturnContent />
    </Suspense>
  );
}