import Link from "next/link";

export default function Pricing() {
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
        <div className="rounded-2xl p-6 border-2" style={{ borderColor: "var(--color-sand)", backgroundColor: "white" }}>
          <p className="font-display font-bold text-2xl" style={{ color: "var(--color-turmeric)" }}>
            Rp 49.000<span className="text-sm opacity-60">/bulan</span>
          </p>
          <p className="text-xs opacity-50 mt-2">
            Pembayaran belum aktif — halaman ini masih placeholder untuk validasi minat.
          </p>
        </div>
      </div>
    </div>
  );
}