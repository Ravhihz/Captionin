import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function generateContent(systemPrompt: string, userPrompt: string) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 1200, // naik dari 800 — caption lebih panjang butuh headroom lebih, reasoning token ikut makan budget ini
    reasoning_effort: "low", // caption nggak butuh reasoning berat, hemat token & lebih cepat
  });

  const choice = completion.choices[0];
  if (choice?.finish_reason === "length") {
    // Kalau ini sering muncul di log, berarti max_tokens masih kurang dan output kepotong
    console.warn("[generateContent] output terpotong karena max_tokens tercapai");
  }

  const raw = choice?.message?.content || "";
  // Bersihin markdown bold/italic yang kadang masih diselipin model meski udah dilarang di prompt
  return raw.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
}