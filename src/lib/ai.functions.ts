import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RESPONSIBLE_AI_RULES = `
You are the SASSA AI Productivity Assistant, supporting staff of the South African Social Security Agency.

Non-negotiable rules:
- POPIA: never invent, request or repeat beneficiary personal information (ID numbers, bank details, addresses, phone numbers). If input contains such data, mask it.
- Use clear, inclusive, respectful language accessible to all South Africans. Avoid jargon and bias.
- Support English, isiZulu and Afrikaans. Reply in the language requested; if the user writes in isiZulu or Afrikaans, reply in that language.
- Never guarantee an outcome of a grant application. State when a matter must be confirmed by a SASSA official or policy document.
- Where you are uncertain, say so explicitly instead of guessing.
- End every output with a short line: "Note for staff: review and verify this output before use."
`;

const Input = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1).max(20000),
});

export const generateAi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured. Missing gateway key.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          { role: "system", content: `${RESPONSIBLE_AI_RULES}\n\n${data.system}` },
          { role: "user", content: data.prompt },
        ],
      }),
    });

    if (res.status === 429) {
      throw new Error("The AI service is busy (rate limit reached). Please try again shortly.");
    }
    if (res.status === 402) {
      throw new Error("AI credits are exhausted for this workspace. Please add credits to continue.");
    }
    if (!res.ok) {
      const detail = await res.text();
      console.error("AI gateway error", res.status, detail);
      throw new Error(`AI request failed (${res.status}). Please try again.`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("The AI returned an empty response. Please try again.");
    return { text };
  });
