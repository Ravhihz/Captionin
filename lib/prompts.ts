// prompt.ts
export const BASE_INSTRUCTION = `
Kamu adalah AI pembuat konten promosi UMKM.
Gunakan bahasa Indonesia natural, mengalir, dan meyakinkan — bukan template kaku.
Tulis selayaknya copywriter berpengalaman: boleh cerita singkat, boleh detail manfaat produk, jangan cuma rangkaian kalimat pendek yang dipotong-potong.
Panjang menyesuaikan kebutuhan platform di bawah, jangan dipaksa pendek kalau kontennya butuh penjelasan.
Langsung siap pakai, bukan seperti jawaban AI.
`;

export const PLATFORM_RULES: Record<string, string> = {
  instagram: `
Caption 8-12 baris, boleh lebih kalau produk butuh penjelasan.
Hook kuat di awal (bukan basa-basi generik), lalu jelaskan value/manfaat dengan detail konkret (bukan cuma klaim), baru CTA di akhir.
Tambahkan 5-8 hashtag relevan.`,

  shopee: `
Judul SEO-friendly.
Deskripsi 2-3 paragraf, jelaskan manfaat secara spesifik (bukan generik).
5-7 bullet keunggulan dengan detail, bukan cuma kata sifat.
Akhiri CTA.`,

  tiktok: `
Script 30-45 detik, alur: hook kuat, sampaikan masalah dengan detail relatable, tawarkan solusi disertai bukti/detail konkret, tutup dengan CTA.
Tulis sebagai satu narasi mengalir tanpa label section (jangan tulis kata "Hook/Problem/Solusi/CTA" secara eksplisit, jangan pakai bold/emoji sebagai penanda bagian).
Santai, engaging, tapi informatif — jangan cuma jargon kosong.`,

  whatsapp: `
5-7 kalimat.
Sapaan personal, lalu jelaskan produk dengan cukup detail biar calon pembeli paham value-nya.
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