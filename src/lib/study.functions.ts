import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  ARTIFACT_PROMPTS,
  TUTOR_SYSTEM,
  callAI,
  callAIJson,
  vivaEvaluatePrompt,
  vivaQuestionPrompt,
  withSource,
  type ChatMessage,
} from "./ai.server";
import { extractText } from "./extract.server";

export const ingestDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        fileName: z.string().min(1),
        title: z.string().min(1),
        base64: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { text, pages, fileType } = await extractText(data.fileName, data.base64);
    if (!text || text.length < 40) {
      throw new Error(
        "Could not read any text from that file. Scanned/image-only PDFs are not supported — try pasting the text instead.",
      );
    }
    const { data: row, error } = await context.supabase
      .from("documents")
      .insert({ user_id: context.userId, title: data.title, file_type: fileType, pages, content: text })
      .select("id, title, file_type, pages, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { document: row, characters: text.length };
  });

export const saveTextDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ title: z.string().min(1), content: z.string().min(40) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("documents")
      .insert({
        user_id: context.userId,
        title: data.title,
        file_type: "TXT",
        pages: Math.max(1, Math.round(data.content.length / 1800)),
        content: data.content,
      })
      .select("id, title, file_type, pages, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { document: row };
  });

export const askStudyGenie = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        question: z.string().min(1).max(4000),
        documentId: z.string().uuid().nullish(),
        thread: z.string().default("main"),
        history: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
          .max(20)
          .default([]),
        persist: z.boolean().default(true),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    let source: string | null = null;
    if (data.documentId) {
      const { data: doc } = await context.supabase
        .from("documents")
        .select("content")
        .eq("id", data.documentId)
        .maybeSingle();
      source = doc?.content ?? null;
    }

    const messages: ChatMessage[] = [
      { role: "system", content: TUTOR_SYSTEM },
      ...data.history.map((m) => ({ role: m.role, content: m.content }) as ChatMessage),
      { role: "user", content: withSource(data.question, source) },
    ];

    const answer = await callAI(messages);

    if (data.persist) {
      await context.supabase.from("messages").insert([
        {
          user_id: context.userId,
          document_id: data.documentId ?? null,
          thread: data.thread,
          role: "user",
          content: data.question,
        },
        {
          user_id: context.userId,
          document_id: data.documentId ?? null,
          thread: data.thread,
          role: "assistant",
          content: answer,
        },
      ]);
    }

    return { answer };
  });

export const generateArtifact = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        kind: z.enum(["summary", "mcq", "important", "flashcards"]),
        topic: z.string().min(1).max(200),
        documentId: z.string().uuid().nullish(),
        count: z.number().int().min(3).max(20).default(10),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    let source: string | null = null;
    if (data.documentId) {
      const { data: doc } = await context.supabase
        .from("documents")
        .select("content")
        .eq("id", data.documentId)
        .maybeSingle();
      source = doc?.content ?? null;
    }

    const prompt = ARTIFACT_PROMPTS[data.kind]!(data.topic, data.count);
    const payload = await callAIJson<Record<string, unknown>>([
      { role: "system", content: `${TUTOR_SYSTEM} Always answer with valid JSON only.` },
      { role: "user", content: withSource(prompt, source) },
    ]);

    const { data: row, error } = await context.supabase
      .from("artifacts")
      .insert({
        user_id: context.userId,
        document_id: data.documentId ?? null,
        kind: data.kind,
        topic: data.topic,
        payload,
      })
      .select("id, kind, topic, payload, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { artifact: row };
  });

export const vivaNextQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        topic: z.string().min(1).max(200),
        asked: z.array(z.string()).max(20).default([]),
        documentId: z.string().uuid().nullish(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    let source: string | null = null;
    if (data.documentId) {
      const { data: doc } = await context.supabase
        .from("documents")
        .select("content")
        .eq("id", data.documentId)
        .maybeSingle();
      source = doc?.content ?? null;
    }
    const result = await callAIJson<{ question: string }>([
      { role: "system", content: `${TUTOR_SYSTEM} Always answer with valid JSON only.` },
      { role: "user", content: withSource(vivaQuestionPrompt(data.topic, data.asked), source) },
    ]);
    return result;
  });

export const vivaEvaluate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        topic: z.string().min(1).max(200),
        question: z.string().min(1),
        answer: z.string().min(1).max(4000),
        documentId: z.string().uuid().nullish(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    let source: string | null = null;
    if (data.documentId) {
      const { data: doc } = await context.supabase
        .from("documents")
        .select("content")
        .eq("id", data.documentId)
        .maybeSingle();
      source = doc?.content ?? null;
    }
    const result = await callAIJson<{
      score: number;
      verdict: string;
      feedback: string;
      modelAnswer: string;
    }>([
      { role: "system", content: `${TUTOR_SYSTEM} Always answer with valid JSON only.` },
      {
        role: "user",
        content: withSource(vivaEvaluatePrompt(data.topic, data.question, data.answer), source),
      },
    ]);
    return result;
  });
