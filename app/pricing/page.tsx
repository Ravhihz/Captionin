"use client";

import { useState } from "react";
import Link from "next/link";

const PAYMENT_METHODS = [
  { value: "BC", label: "BCA VA" },
  { value: "M2", label: "Mandiri VA" },
  { value: "BR", label: "BRI VA" },
  { value: "GQ", label: "QRIS" },
];

export default function Pricing() {
  const [method, setMethod] = useState("BC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: method }),
      });
      const data = await res.json();

      if (res.status === 401) { setError("Kamu harus login dulu."); return; }
      if (!res.ok) { setError(data.error || "Gagal memulai pembayaran."); return; }

      window.location.href = data.paymentUrl;
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-md w-full text-center space-y-5">
        <Link href="/" className="text-sm underline opacity-60">← Kembali</Link>
        <h1 className="font-display font-extrabold text-2xl" style={{ color: "var(--color-ink)" }}>
          Kuota harianmu habis
        </h1>
        <p className="opacity-70">
          Upgrade ke Premium untuk generate konten tanpa batas dan akses semua platform.
        </p>

        <div className="rounded-2xl p-6 border-2 space-y-4" style={{ borderColor: "var(--color-sand)", backgroundColor: "white" }}>
          <p className="font-display font-bold text-2xl" style={{ color: "var(--color-turmeric)" }}>
            Rp 49.000<span className="text-sm opacity-60">/30 hari</span>
          </p>

          <div>
            <p className="text-xs uppercase tracking-wide opacity-50 mb-2">Metode pembayaran</p>
            <div className="flex flex-wrap justify-center gap-2">
              {PAYMENT_METHODS.map((m) => {
                const active = method === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMethod(m.value)}
                    className="px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-150 active:scale-[0.96]"
                    style={
                      active
                        ? { backgroundColor: "var(--color-pandan)", borderColor: "var(--color-pandan)", color: "white" }
                        : { borderColor: "var(--color-sand)", color: "var(--color-ink)" }
                    }
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-40 transition-all duration-150 enabled:hover:brightness-110 enabled:active:scale-[0.98]"
            style={{ backgroundColor: "var(--color-pandan)" }}
          >
            {loading ? "Memproses..." : "Bayar Sekarang"}
          </button>

          {error && <p className="text-sm" style={{ color: "var(--color-chili)" }}>{error}</p>}

          <p className="text-xs opacity-40">
            Pembayaran diproses lewat Duitku (sandbox). Setelah bayar, kamu akan diarahkan balik ke sini.
          </p>
        </div>
      </div>
    </div>
  );
}