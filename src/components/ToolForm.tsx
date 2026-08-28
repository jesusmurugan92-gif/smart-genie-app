import { type ReactNode } from "react";

import { DocumentPicker } from "@/components/AppShell";
import type { DocumentRow } from "@/hooks/useDocuments";

export function ToolForm({
  documents,
  topic,
  setTopic,
  documentId,
  setDocumentId,
  count,
  setCount,
  busy,
  error,
  onSubmit,
  cta,
  placeholder,
  extra,
}: {
  documents: DocumentRow[];
  topic: string;
  setTopic: (v: string) => void;
  documentId: string;
  setDocumentId: (v: string) => void;
  count?: number;
  setCount?: (v: number) => void;
  busy: boolean;
  error: string | null;
  onSubmit: () => void;
  cta: string;
  placeholder: string;
  extra?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-paper p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Topic
          </span>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </label>
        <DocumentPicker documents={documents} value={documentId} onChange={setDocumentId} />
        {typeof count === "number" && setCount && (
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              How many ({count})
            </span>
            <input
              type="range"
              min={3}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </label>
        )}
        {extra}
      </div>

      <button
        onClick={onSubmit}
        disabled={busy || !topic.trim()}
        className="mt-6 rounded-lg bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background disabled:opacity-40"
      >
        {busy ? "StudyGenie is thinking…" : cta}
      </button>

      {error && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
