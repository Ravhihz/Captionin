"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "shopee", label: "Shopee", icon: "🛒" },
  { value: "tiktok", label: "TikTok", icon: "🎵" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
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
  const [copied, setCopied] = useState(false);

  const MAX_DESC = 500;

  async function handleCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

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
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <Image
          src="/logo.webp"
          alt="Captionin"
          width={64}
          height={64}
          priority
          className="rounded-full animate-pulse"
        />
        <div
          className="w-6 h-6 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-turmeric)", borderTopColor: "transparent" }}
        />
        <p className="text-sm opacity-60">Memuat...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className="min-h-screen relative flex flex-col items-center justify-center gap-8 px-6 py-16"
        style={{
          backgroundImage: "url('/background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay: turun ke 0.72 supaya background masih kelihatan tapi teks tetap kontras */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255, 251, 243, 0.72)" }} />

        <div className="relative flex flex-col items-center gap-6 max-w-lg w-full">
          <Image src="/logo.webp" alt="Captionin" width={112} height={112} priority className="rounded-full shadow-lg" />

          <div className="text-center space-y-2">
            <h1 className="font-display font-extrabold text-2xl" style={{ color: "var(--color-ink)" }}>
              Konten promosi jadi, tanpa mikir kata-kata
            </h1>
            <p className="opacity-70 text-sm">
              Bikin caption untuk Instagram, Shopee, TikTok, dan WhatsApp dalam hitungan detik.
            </p>
          </div>

          <button
            onClick={() => signIn("google")}
            className="px-6 py-3 rounded-full font-semibold text-white shadow-md transition-all duration-150 hover:brightness-110 hover:shadow-lg active:scale-[0.97]"
            style={{ backgroundColor: "var(--color-turmeric)" }}
          >
            Masuk dengan Google
          </button>

          {/* Value prop cards — fade-in satu-satu biar gak muncul kaku barengan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4">
            {[
              { icon: "⚡", title: "Kilat", desc: "Caption jadi dalam hitungan detik, bukan menit" },
              { icon: "📱", title: "Multi Platform", desc: "IG, Shopee, TikTok, WhatsApp — sekali generate" },
              { icon: "🎁", title: "Gratis Tiap Hari", desc: "Kuota harian gratis, upgrade kalau kurang" },
            ].map((card, i) => (
              <div
                key={card.title}
                className="rounded-2xl p-4 text-center space-y-1 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up"
                style={{ backgroundColor: "white", border: "2px solid var(--color-sand)", animationDelay: `${i * 100}ms` }}
              >
                <div className="text-2xl">{card.icon}</div>
                <p className="font-display font-bold text-sm" style={{ color: "var(--color-ink)" }}>{card.title}</p>
                <p className="text-xs opacity-60">{card.desc}</p>
              </div>
            ))}
          </div>
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
            <Link href="/profile" className="text-sm font-semibold underline opacity-80 transition-opacity hover:opacity-100">
              Profil
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-semibold px-4 py-2 rounded-full text-white transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
              style={{ backgroundColor: "var(--color-chili)" }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-5 space-y-4 border-2" style={{ borderColor: "var(--color-sand)", backgroundColor: "white" }}>
          <input
            className="w-full border-2 rounded-xl p-3 outline-none transition-colors focus:border-[var(--color-pandan)]"
            style={{ borderColor: "var(--color-sand)" }}
            placeholder="Nama produk"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <div>
            <textarea
              className="w-full border-2 rounded-xl p-3 outline-none transition-colors focus:border-[var(--color-pandan)]"
              style={{ borderColor: "var(--color-sand)" }}
              placeholder="Deskripsi produk"
              rows={3}
              maxLength={MAX_DESC}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p
              className="text-xs text-right mt-1 opacity-50 transition-colors"
              style={description.length > MAX_DESC * 0.9 ? { color: "var(--color-chili)", opacity: 1 } : undefined}
            >
              {description.length}/{MAX_DESC}
            </p>
          </div>
          <input
            className="w-full border-2 rounded-xl p-3 outline-none transition-colors focus:border-[var(--color-pandan)]"
            style={{ borderColor: "var(--color-sand)" }}
            placeholder="Target market (opsional)"
            value={targetMarket}
            onChange={(e) => setTargetMarket(e.target.value)}
          />

          <div>
            <p className="text-xs uppercase tracking-wide opacity-50 mb-2">Platform</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const active = platform === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlatform(p.value)}
                    className="px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-150 active:scale-[0.96]"
                    style={
                      active
                        ? { backgroundColor: "var(--color-pandan)", borderColor: "var(--color-pandan)", color: "white" }
                        : { borderColor: "var(--color-sand)", color: "var(--color-ink)" }
                    }
                  >
                    {p.icon} {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide opacity-50 mb-2">Tone</p>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => {
                const active = tone === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className="px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-150 active:scale-[0.96]"
                    style={
                      active
                        ? { backgroundColor: "var(--color-turmeric)", borderColor: "var(--color-turmeric)", color: "white" }
                        : { borderColor: "var(--color-sand)", color: "var(--color-ink)" }
                    }
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !productName || !description}
            className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-40 transition-all duration-150 enabled:hover:brightness-110 enabled:active:scale-[0.98]"
            style={{ backgroundColor: "var(--color-pandan)" }}
          >
            {loading ? "Membuat..." : "Generate Konten"}
          </button>
        </div>

        {error && <p style={{ color: "var(--color-chili)" }}>{error}</p>}
        {remaining !== null && (
          <p
            className="text-sm inline-block px-3 py-1 rounded-full"
            style={{
              backgroundColor: remaining <= 1 ? "var(--color-chili)" : "var(--color-sand)",
              color: remaining <= 1 ? "white" : "var(--color-ink)",
              opacity: remaining <= 1 ? 1 : 0.8,
            }}
          >
            Sisa kuota hari ini: {remaining}
          </p>
        )}

        {loading && (
          <div className="rounded-2xl p-5 border-2 space-y-2" style={{ borderColor: "var(--color-sand)", backgroundColor: "white" }}>
            <div className="h-3 rounded animate-skeleton" style={{ backgroundColor: "var(--color-sand)", width: "70%" }} />
            <div className="h-3 rounded animate-skeleton" style={{ backgroundColor: "var(--color-sand)", width: "90%" }} />
            <div className="h-3 rounded animate-skeleton" style={{ backgroundColor: "var(--color-sand)", width: "40%" }} />
          </div>
        )}

        {!loading && result && (
          <div className="relative animate-fade-in-up">
            <div className="rounded-t-lg p-5 border-2 border-b-0" style={{ borderColor: "var(--color-sand)", backgroundColor: "white" }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-widest opacity-50">Hasil — {platform}</p>
                <button
                  onClick={handleCopy}
                  className="text-xs font-semibold px-3 py-1 rounded-full transition-all duration-150 active:scale-[0.95]"
                  style={{ backgroundColor: "var(--color-sand)", color: "var(--color-ink)" }}
                >
                  {copied ? "Disalin ✓" : "Salin teks"}
                </button>
              </div>
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