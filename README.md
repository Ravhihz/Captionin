<div align="center">

# 🪄 Captionin

**AI Content Generator untuk UMKM Indonesia**

Bikin caption Instagram, Shopee, TikTok, dan WhatsApp dalam hitungan detik — tanpa mikir kata-kata.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Groq](https://img.shields.io/badge/AI-Groq%20%2F%20gpt--oss--20b-F55036)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[Demo](https://captionin.varstory.my.id) · [Laporkan Bug](#) · [Ajukan Fitur](#)

</div>

---

## 📖 Tentang Captionin

UMKM sering stuck bukan karena produknya nggak bagus, tapi karena bingung nulis caption yang jual. Captionin nge-generate konten promosi siap pakai — disesuaikan gaya dan struktur tiap platform, bukan satu template generik buat semua.

## ✨ Fitur

| Fitur | Deskripsi |
|---|---|
| 🔐 **Login Google** | Autentikasi via NextAuth, sekali klik |
| 🎯 **4 Platform** | Instagram, Shopee, TikTok, WhatsApp — masing-masing punya struktur & tone sendiri |
| 🎨 **5 Tone Pilihan** | Santai, Formal, Hard Selling, Soft Selling, Storytelling |
| ⚡ **Generate Instan** | Ditenagai Groq (`openai/gpt-oss-20b`), respons dalam hitungan detik |
| 📊 **Kuota Harian** | 5x gratis/hari, upgrade ke Premium untuk generate tanpa batas |
| 💳 **Pembayaran Lokal** | Duitku — VA BCA/Mandiri/BRI & QRIS |
| 📝 **Riwayat Generate** | Semua caption yang pernah dibuat tersimpan dan bisa diakses ulang |

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Auth:** NextAuth.js (Google OAuth)
- **AI Inference:** Groq API (`openai/gpt-oss-20b`)
- **Database/Cache:** Upstash Redis (rate limiting, status premium, riwayat)
- **Payment:** Duitku
- **Analytics:** Vercel Analytics
- **Styling:** Tailwind CSS, custom design system (warna khas Indonesia: turmeric, pandan, chili)

## 🚀 Menjalankan Secara Lokal

```bash
git clone https://github.com/ravhihz/captionin.git
cd captionin
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## ⚙️ Environment Variables

Buat file `.env.local` di root project:

| Variable | Keterangan |
|---|---|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Kredensial OAuth dari Google Cloud Console |
| `NEXTAUTH_SECRET` | Random string untuk enkripsi session (`openssl rand -base64 32`) |
| `GROQ_API_KEY` | API key dari [console.groq.com](https://console.groq.com) — satu-satunya AI provider yang aktif dipakai saat ini |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Dari dashboard [Upstash](https://upstash.com) |
| `DUITKU_MERCHANT_CODE` / `DUITKU_API_KEY` | Kredensial merchant Duitku |
| `NEXT_PUBLIC_APP_URL` | URL production, misal `https://captionin.varstory.my.id` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` / `NEXT_PUBLIC_SUPPORT_PHONE` / `NEXT_PUBLIC_SUPPORT_ADDRESS` | Ditampilkan di footer |

> ⚠️ `@anthropic-ai/sdk` dan `@google/generative-ai` ada di `package.json` untuk rencana dukungan multi-provider ke depan, tapi belum diwire ke `lib/ai.ts`. Belum perlu di-set sekarang.

## 🗺️ Roadmap

- [ ] Approval & go-live Duitku (masih sandbox)
- [ ] Dashboard analytics penggunaan
- [ ] Caching prompt untuk efisiensi biaya API
- [ ] Kustomisasi prompt lanjutan per user

## 📄 Lisensi

MIT — lihat [LICENSE](./LICENSE).

---

<div align="center">
<sub>Dibuat oleh <a href="https://github.com/ravhihz">Ravhihz</a> · Tangerang Selatan, Indonesia</sub>
</div>
