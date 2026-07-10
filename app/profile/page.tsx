"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import type { HistoryEntry } from "@/lib/history";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/history")
        .then((res) => res.json())
        .then((data) => setHistory(data.history || []))
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
          <p className="font-display font-bold text-lg">{session.user?.email}</p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg mb-3">Riwayat Generate</h2>

          {loading && <p className="opacity-60">Memuat riwayat...</p>}
          {!loading && history.length === 0 && (
            <p className="opacity-60">Belum ada riwayat. Mulai generate konten pertamamu.</p>
          )}

          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="relative">
                <div
                  className="rounded-t-lg p-4 border-2 border-b-0"
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
                  <p className="text-sm whitespace-pre-wrap font-mono opacity-80">
                    {item.content.slice(0, 200)}
                    {item.content.length > 200 ? "..." : ""}
                  </p>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}