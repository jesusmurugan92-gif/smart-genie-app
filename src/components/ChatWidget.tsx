import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { askStudyGenie } from "@/lib/study.functions";
import { useAuth } from "@/hooks/useAuth";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm StudyGenie. Ask me anything from your syllabus — for example *What is JVM?* or *Explain inheritance in Java in simple words.*",
};

export function ChatWidget() {
  const { session } = useAuth();
  const ask = useServerFn(askStudyGenie);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (!session) return null;

  async function send() {
    const question = input.trim();
    if (!question || busy) return;
    setInput("");
    setError(null);
    const history = messages.filter((m) => m !== GREETING).slice(-8);
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setBusy(true);
    try {
      const res = await ask({ data: { question, thread: "widget", history, persist: true } });
      setMessages((prev) => [...prev, { role: "assistant", content: res.answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-xs font-bold uppercase tracking-widest text-background shadow-2xl transition-transform active:scale-95"
      >
        <span className="size-2 rounded-full bg-primary" />
        Ask StudyGenie
      </button>
    );
  }

  return (
    <div className="animate-rise fixed bottom-6 right-6 z-50 flex w-[22rem] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl md:w-96">
      <div className="flex items-center justify-between bg-foreground px-4 py-3 text-background">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary" />
          <span className="text-xs font-bold uppercase tracking-wider">🤖 StudyGenie Assistant</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Minimise assistant"
          className="text-lg text-background/60 hover:text-background"
        >
          —
        </button>
      </div>

      <div ref={scroller} className="h-80 space-y-4 overflow-y-auto bg-background p-4">
        {messages.map((m, i) =>
          m.role === "assistant" ? (
            <div key={i} className="flex gap-3">
              <span className="mt-1 size-6 shrink-0 rounded-full bg-primary" />
              <div className="prose-genie rounded-2xl rounded-tl-none bg-secondary p-3 text-xs">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-row-reverse gap-3">
              <span className="mt-1 size-6 shrink-0 rounded-full bg-accent" />
              <div className="rounded-2xl rounded-tr-none bg-foreground p-3 text-xs leading-relaxed text-background">
                {m.content}
              </div>
            </div>
          ),
        )}
        {busy && (
          <div className="flex gap-3">
            <span className="mt-1 size-6 shrink-0 animate-pulse rounded-full bg-primary" />
            <p className="rounded-2xl rounded-tl-none bg-secondary p-3 text-xs italic text-muted-foreground">
              StudyGenie is typing…
            </p>
          </div>
        )}
        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="border-t border-border bg-paper p-3">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void send();
            }}
            placeholder="Type your question…"
            className="w-full rounded-xl border border-transparent bg-secondary py-3 pl-4 pr-10 text-xs outline-none transition-all focus:border-accent"
          />
          <button
            onClick={() => void send()}
            disabled={busy}
            aria-label="Send question"
            className="absolute right-2 top-1.5 rounded-lg bg-foreground p-1.5 text-xs text-background disabled:opacity-40"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
