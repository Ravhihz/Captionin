import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function generateContent(systemPrompt: string, userPrompt: string) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: systemPrompt }, // statis -> berpeluang kena prompt caching
      { role: "user", content: userPrompt }, // dinamis per produk
    ],
    max_tokens: 350, // cukup buat caption/deskripsi pendek, hemat biaya output
  });

  return completion.choices[0]?.message?.content || "";
}