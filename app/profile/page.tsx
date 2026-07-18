"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import type { HistoryEntry } from "@/lib/history";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [premium, setPremium] = useState(false);

  async function handleCopy(id: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/history")
        .then((res) => res.json())
        .then((data) => {
          setHistory(data.history || []);
          setPremium(Boolean(data.premium));
        })
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading") return <div className="p-8">Memuat...</div>;
  if (!session) return <div className="p-8">Kamu belum login.</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display font-extrabold text-xl" style={{ color: "var(--color-ink)" }}>
            ← Captionin
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm font-semibold px-4 py-2 rounded-full text-white"
            style={{ backgroundColor: "var(--color-chili)" }}
          >
            Logout
          </button>
        </div>

        <div
          className="rounded-2xl p-5 border-2"
          style={{ borderColor: "var(--color-sand)", backgroundColor: "white" }}
        >
          <p className="text-xs uppercase tracking-wide opacity-60">Akun</p>
          <p className="font-display font-bold text-lg mb-3">{session.user?.email}</p>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: premium ? "var(--color-pandan)" : "var(--color-sand)", color: premium ? "white" : "var(--color-ink)" }}
            >
              {premium ? "✨ Premium" : "Gratis"}
            </span>

            {!premium && (
              <Link
                href="/pricing"
                className="text-xs font-semibold underline"
                style={{ color: "var(--color-turmeric)" }}
              >
                Upgrade ke Premium →
              </Link>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg mb-3">Riwayat Generate</h2>

          {loading && <p className="opacity-60">Memuat riwayat...</p>}
          {!loading && history.length === 0 && (
            <p className="opacity-60">Belum ada riwayat. Mulai generate konten pertamamu.</p>
          )}

          <div className="space-y-4">
            {history.map((item, i) => {
              const isExpanded = expandedId === item.id;
              const isLong = item.content.length > 200;
              const shownText = isExpanded || !isLong ? item.content : item.content.slice(0, 200) + "...";

              return (
                <div
                  key={item.id}
                  className="relative animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className="rounded-t-lg p-4 border-2 border-b-0 transition-shadow hover:shadow-sm"
                    style={{ borderColor: "var(--color-sand)", backgroundColor: "white" }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: "var(--color-pandan)" }}
                      >
                        {item.platform}
                      </span>
                      <span className="text-xs opacity-50">
                        {new Date(item.createdAt).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-1">{item.productName}</p>
                    <p className="text-sm whitespace-pre-wrap font-mono opacity-80">{shownText}</p>

                    <div className="flex items-center gap-3 mt-3">
                      {isLong && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="text-xs font-semibold underline opacity-70 transition-opacity hover:opacity-100"
                        >
                          {isExpanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(item.id, item.content)}
                        className="text-xs font-semibold px-3 py-1 rounded-full transition-all duration-150 active:scale-[0.95]"
                        style={{ backgroundColor: "var(--color-sand)", color: "var(--color-ink)" }}
                      >
                        {copiedId === item.id ? "Disalin ✓" : "Salin teks"}
                      </button>
                    </div>
                  </div>
                  <div
                    className="h-2 border-2 border-t-0 rounded-b-lg"
                    style={{
                      borderColor: "var(--color-sand)",
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent, transparent 6px, var(--color-sand) 6px, var(--color-sand) 10px)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}