"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "shopee", label: "Shopee" },
  { value: "tiktok", label: "TikTok" },
  { value: "whatsapp", label: "WhatsApp" },
];

const TONES = [
  { value: "", label: "Otomatis" },
  { value: "santai", label: "Santai" },
  { value: "formal", label: "Formal" },
  { value: "hard selling", label: "Hard Selling" },
  { value: "soft selling", label: "Soft Selling" },
  { value: "storytelling", label: "Storytelling" },
];

export default function Home() {
  const { data: session, status } = useSession();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("");

  const [result, setResult] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, description, targetMarket, platform, tone }),
      });
      const data = await res.json();

      if (res.status === 401) { setError("Kamu harus login dulu."); return; }
      if (res.status === 429) { window.location.href = "/pricing"; return; }
      if (!res.ok) { setError(data.error || "Terjadi kesalahan."); return; }

      setResult(data.content);
      setRemaining(data.remaining);
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>Memuat...</div>;
  }

  if (!session) {
    return (
      <div
        className="min-h-screen relative flex flex-col items-center justify-center gap-6 px-6"
        style={{
          backgroundImage: "url('/background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay supaya teks & tombol tetap terbaca di atas background yang ramai */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255, 251, 243, 0.82)" }} />

        <div className="relative flex flex-col items-center gap-6">
          <Image src="/logo.webp" alt="Captionin" width={112} height={112} priority className="rounded-full shadow-md" />
          <p className="text-center max-w-sm opacity-70">
            Bikin konten promosi untuk Instagram, Shopee, TikTok, dan WhatsApp dalam hitungan detik.
          </p>
          <button
            onClick={() => signIn("google")}
            className="px-6 py-3 rounded-full font-semibold text-white shadow-md"
            style={{ backgroundColor: "var(--color-turmeric)" }}
          >
            Masuk dengan Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-display font-extrabold text-xl" style={{ color: "var(--color-ink)" }}>
            <Image src="/logo.webp" alt="Captionin" width={32} height={32} className="rounded-full" />
            Captionin
          </span>
          <div className="flex items-center gap-3">
            <Link href="/profile" className="text-sm font-semibold underline opacity-80">
              Profil
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-semibold px-4 py-2 rounded-full text-white"
              style={{ backgroundColor: "var(--color-chili)" }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-5 space-y-4 border-2" style={{ borderColor: "var(--color-sand)", backgroundColor: "white" }}>
          <input
            className="w-full border-2 rounded-xl p-3 outline-none focus:border-[var(--color-pandan)]"
            style={{ borderColor: "var(--color-sand)" }}
            placeholder="Nama produk"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <textarea
            className="w-full border-2 rounded-xl p-3 outline-none focus:border-[var(--color-pandan)]"
            style={{ borderColor: "var(--color-sand)" }}
            placeholder="Deskripsi produk"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full border-2 rounded-xl p-3 outline-none focus:border-[var(--color-pandan)]"
            style={{ borderColor: "var(--color-sand)" }}
            placeholder="Target market (opsional)"
            value={targetMarket}
            onChange={(e) => setTargetMarket(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              className="border-2 rounded-xl p-3"
              style={{ borderColor: "var(--color-sand)" }}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {PLATFORMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <select
              className="border-2 rounded-xl p-3"
              style={{ borderColor: "var(--color-sand)" }}
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !productName || !description}
            className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-40"
            style={{ backgroundColor: "var(--color-pandan)" }}
          >
            {loading ? "Membuat..." : "Generate Konten"}
          </button>
        </div>

        {error && <p style={{ color: "var(--color-chili)" }}>{error}</p>}
        {remaining !== null && <p className="text-sm opacity-60">Sisa kuota hari ini: {remaining}</p>}

        {result && (
          <div className="relative">
            <div className="rounded-t-lg p-5 border-2 border-b-0" style={{ borderColor: "var(--color-sand)", backgroundColor: "white" }}>
              <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Hasil — {platform}</p>
              <p className="whitespace-pre-wrap font-mono text-sm">{result}</p>
            </div>
            <div
              className="h-2 border-2 border-t-0 rounded-b-lg"
              style={{
                borderColor: "var(--color-sand)",
                backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 6px, var(--color-sand) 6px, var(--color-sand) 10px)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}