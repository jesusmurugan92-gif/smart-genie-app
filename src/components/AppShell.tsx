import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Logo } from "@/components/Logo";
import { studentName, useAuth } from "@/hooks/useAuth";

const NAV: { to: string; label: string }[] = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/documents", label: "📚 My Documents" },
  { to: "/upload", label: "📤 Upload Notes" },
  { to: "/ask", label: "🧠 Ask StudyGenie" },
  { to: "/quiz", label: "📝 Generate MCQs" },
  { to: "/summary", label: "📖 Summarize Notes" },
  { to: "/important", label: "🎯 Important Questions" },
  { to: "/flashcards", label: "🃏 Flashcards" },
  { to: "/viva", label: "🎤 Viva Mode" },
  { to: "/progress", label: "📊 My Progress" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/85 px-6 py-4 backdrop-blur-md">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
            {studentName(user)}
          </span>
          <button
            onClick={() => void signOut()}
            className="rounded-full bg-foreground px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-background transition-transform active:scale-95"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-primary/25 font-bold" }}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-primary/25 font-bold" }}
                className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export function DocumentPicker({
  documents,
  value,
  onChange,
}: {
  documents: { id: string; title: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Source document
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent"
      >
        <option value="">No document — use general knowledge</option>
        {documents.map((d) => (
          <option key={d.id} value={d.id}>
            {d.title}
          </option>
        ))}
      </select>
    </label>
  );
}
