import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function generateContent(systemPrompt: string, userPrompt: string) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 800, // naik dari 350 — model reasoning butuh ruang buat "mikir" + nulis jawaban
    reasoning_effort: "low", // caption pendek nggak butuh reasoning berat, hemat token & lebih cepat
  });

  const raw = completion.choices[0]?.message?.content || "";
  // Bersihin markdown bold/italic yang kadang masih diselipin model meski udah dilarang di prompt
  return raw.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
}