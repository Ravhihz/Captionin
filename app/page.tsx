"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

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
        body: JSON.stringify({
          productName,
          description,
          targetMarket,
          platform,
          tone,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setError("Kamu harus login dulu.");
        return;
      }

      if (res.status === 429) {
        window.location.href = "/pricing";
        return;
      }

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan.");
        return;
      }

      setResult(data.content);
      setRemaining(data.remaining);
    } catch (err) {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <div className="p-8">Memuat...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => signIn("google")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          Login dengan Google untuk mulai
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Captionin</h1>
        <button onClick={() => signOut()} className="text-sm text-gray-500 underline">
          Logout ({session.user?.email})
        </button>
      </div>

      <div className="space-y-4">
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Nama produk"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <textarea
          className="w-full border rounded-lg p-3"
          placeholder="Deskripsi produk"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Target market (opsional)"
          value={targetMarket}
          onChange={(e) => setTargetMarket(e.target.value)}
        />

        <select
          className="w-full border rounded-lg p-3"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <select
          className="w-full border rounded-lg p-3"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          {TONES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading || !productName || !description}
          className="w-full bg-black text-white py-3 rounded-lg font-medium disabled:opacity-40"
        >
          {loading ? "Membuat..." : "Generate Konten"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {remaining !== null && (
        <p className="text-sm text-gray-500">Sisa kuota hari ini: {remaining}</p>
      )}

      {result && (
        <div className="bg-gray-50 border rounded-lg p-4 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}