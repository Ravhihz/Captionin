// prompt.ts
export const BASE_INSTRUCTION = `
Kamu adalah AI pembuat konten promosi UMKM.
Gunakan bahasa Indonesia natural, padat, profesional.
Langsung siap pakai, bukan seperti jawaban AI.
Maksimal 100 kata.
`;

export const PLATFORM_RULES: Record<string, string> = {
  instagram: `
Caption 5-7 baris.
Hook kuat di awal, CTA di akhir.
Tambahkan 3-5 hashtag.`,

  shopee: `
Judul SEO-friendly.
Deskripsi 1 paragraf.
3-5 bullet keunggulan.
Akhiri CTA.`,

  tiktok: `
Script 15-20 detik:
Hook -> Problem -> Solusi -> CTA.
Santai, engaging.`,

  whatsapp: `
3-4 kalimat.
Sapaan personal.
Soft selling + pertanyaan + CTA.`,
};

export function buildPrompt(params: {
  productName: string;
  description: string;
  targetMarket?: string;
  platform: string;
  tone?: string;
}) {
  const { productName, description, targetMarket, platform, tone } = params;

  const rules = PLATFORM_RULES[platform];
  if (!rules) throw new Error("Platform tidak dikenali");

  // Statis & identik untuk semua request di platform yang sama -> kandidat prompt caching di Groq
  const systemPrompt = `
${BASE_INSTRUCTION}

${rules}

Output hanya konten, tanpa embel-embel penjelasan.
`;

  // Dinamis, beda tiap produk -> jangan dicampur ke system prompt
  const userPrompt = `
Produk: ${productName}
Deskripsi: ${description}
${targetMarket ? `Target: ${targetMarket}` : ""}
${tone ? `Tone: ${tone}` : ""}
`;

  return { systemPrompt, userPrompt };
}