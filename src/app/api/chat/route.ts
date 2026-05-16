import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const org = JSON.parse(readFileSync(join(process.cwd(), "data/org.json"), "utf8"));
  const projects = JSON.parse(readFileSync(join(process.cwd(), "data/projects.json"), "utf8"));
  const finances = JSON.parse(readFileSync(join(process.cwd(), "data/finances.json"), "utf8"));

  const client = new Anthropic();

  const systemPrompt = `Du bist ein IT-Support-Assistent für ${org.company}. Du hast Zugriff auf folgende aktuelle Daten:

ORGANISATION:
${JSON.stringify(org, null, 2)}

PROJEKTE:
${JSON.stringify(projects, null, 2)}

FINANZEN:
${JSON.stringify(finances, null, 2)}

Beantworte Fragen klar und präzise auf Deutsch. Nutze die bereitgestellten Daten, um genaue Informationen zu liefern. Formatiere Zahlen leserlich (z.B. Währungen mit € und Tausenderpunkten). Wenn du Mitarbeiternamen nennst, verwende immer den vollen Namen und die Rolle.`;

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
