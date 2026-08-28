const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class AiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function callAI(messages: ChatMessage[], json = false): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError(401, "AI is not configured for this project.");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: false,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text;
    try {
      const parsed = JSON.parse(text) as { error?: { message?: string }; message?: string };
      message = parsed.error?.message ?? parsed.message ?? text;
    } catch {
      /* keep raw text */
    }
    if (res.status === 402) {
      message = message || "AI credits are exhausted. The app owner needs to top up in Lovable.";
    } else if (res.status === 429) {
      message = message || "Too many requests right now — try again in a moment.";
    }
    throw new AiError(res.status, message || `AI request failed (${res.status}).`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

export async function callAIJson<T>(messages: ChatMessage[]): Promise<T> {
  const raw = await callAI(messages, true);
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new AiError(502, "The AI returned an unexpected format. Please try again.");
  }
}

export const TUTOR_SYSTEM =
  "You are StudyGenie, a patient and precise study tutor for college students. " +
  "Explain concepts in simple words, use short paragraphs, concrete analogies and small code examples when relevant. " +
  "Use markdown. Never invent facts that contradict the provided study material. " +
  "If study material is provided, ground every answer in it and say so when the material does not cover the question.";

export function withSource(prompt: string, source?: string | null) {
  if (!source) return prompt;
  const trimmed = source.slice(0, 24000);
  return `STUDY MATERIAL (use this as the source of truth):\n"""\n${trimmed}\n"""\n\n${prompt}`;
}

export const ARTIFACT_PROMPTS: Record<string, (topic: string, count: number) => string> = {
  summary: (topic) =>
    `Summarize the study material about "${topic}". Return JSON exactly as: ` +
    `{"summary": string (2-4 sentences), "keyPoints": string[] (5-8 items), ` +
    `"definitions": [{"term": string, "meaning": string}] (4-6 items), "examQuestions": string[] (4-6 items)}.`,
  mcq: (topic, count) =>
    `Create ${count} exam-style multiple choice questions about "${topic}". Return JSON exactly as: ` +
    `{"questions": [{"question": string, "options": [string, string, string, string], "answerIndex": 0-3, "explanation": string}]}. ` +
    `Exactly 4 options per question, only one correct.`,
  important: (topic, count) =>
    `List the ${count} most likely exam questions for "${topic}". Return JSON exactly as: ` +
    `{"questions": [{"question": string, "why": string (why it matters), "marks": string (e.g. "5 marks")}]}.`,
  flashcards: (topic, count) =>
    `Create ${count} active-recall flashcards for "${topic}". Return JSON exactly as: ` +
    `{"cards": [{"front": string (short question or term), "back": string (concise answer, max 40 words)}]}.`,
};

export function vivaQuestionPrompt(topic: string, asked: string[]) {
  return (
    `You are conducting an oral viva examination on "${topic}". ` +
    `Ask ONE new question, harder than the previous ones. Already asked: ${asked.length ? asked.join(" | ") : "none"}. ` +
    `Return JSON exactly as: {"question": string}.`
  );
}

export function vivaEvaluatePrompt(topic: string, question: string, answer: string) {
  return (
    `Viva topic: "${topic}". Question asked: "${question}". Student's spoken answer: "${answer}". ` +
    `Evaluate strictly but kindly as an examiner. Return JSON exactly as: ` +
    `{"score": integer 0-10, "verdict": string (one short line), "feedback": string (2-4 sentences of markdown, include what was missing), "modelAnswer": string (ideal answer, 3-5 sentences)}.`
  );
}
