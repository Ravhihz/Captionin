# 🚀 Captionin — AI Content Generator

This project is built using [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It serves as an AI-powered platform for generating marketing content across multiple platforms.

---

## 📦 Getting Started

To run the development server locally, use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

After starting the server, open your browser and navigate to:

```
http://localhost:3000
```

You can begin editing the application by modifying:

```
app/page.tsx
```

The page will automatically reload as you make changes.

---

## ✨ Features

* 🔐 Authentication system (NextAuth)
* 🤖 AI-powered content generation (multi-provider ready)
* 📊 User quota & rate limiting
* 📝 Content history tracking
* 🎯 Multi-platform prompt optimization (Instagram, Shopee, TikTok, WhatsApp)

---

## 🎨 Fonts Optimization

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize and load the [Geist](https://vercel.com/font) font family by Vercel for better performance and UI consistency.

---

## 📚 Learn More

To explore more about the technologies used:

* [Next.js Documentation](https://nextjs.org/docs) — comprehensive guide and API reference
* [Learn Next.js](https://nextjs.org/learn) — interactive tutorial
* [Next.js GitHub Repository](https://github.com/vercel/next.js) — source code and contributions

---

## 🚀 Deployment

The easiest way to deploy this application is via the Vercel platform:

👉 https://vercel.com/new

For more detailed instructions, refer to:

👉 https://nextjs.org/docs/app/building-your-application/deploying

---

## ⚙️ Environment Variables

Before deploying, make sure to configure the required environment variables:

* `NEXTAUTH_SECRET`
* `GROQ_API_KEY` / `GOOGLE_API_KEY` / `ANTHROPIC_API_KEY`
* `UPSTASH_REDIS_REST_URL`
* `UPSTASH_REDIS_REST_TOKEN`

Set these variables in your local `.env.local` file and in your deployment platform (e.g., Vercel).

---

## 🧠 Notes

This project is designed as a scalable SaaS-ready AI application. Future improvements may include:

* 💳 Payment integration (Midtrans / Xendit)
* 📈 Analytics dashboard
* ⚡ Caching for cost efficiency
* 🎛️ Advanced prompt customization

---

## 📄 License

This project is open-source and available for personal or commercial use.
