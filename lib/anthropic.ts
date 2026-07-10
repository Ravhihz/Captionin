import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function generateContent(prompt: string) {
  const res = await client.messages.create({
    model: "claude-sonnet-4-5", // cek model terbaru yang tersedia saat kamu deploy
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = res.content.find((b) => b.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}