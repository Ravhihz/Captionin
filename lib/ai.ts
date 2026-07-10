import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function generateContent(prompt: string) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
  });

  return completion.choices[0]?.message?.content || "";
}