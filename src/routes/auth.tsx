import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — StudyGenie AI" },
      {
        name: "description",
        content: "Sign in or create a free StudyGenie AI account to start turning notes into quizzes.",
      },
      { property: "og:title", content: "Sign in — StudyGenie AI" },
      { property: "og:description", content: "Your AI study workspace, one account away." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (session) void navigate({ to: "/dashboard" });
  }, [session, navigate]);

  async function submit() {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (err) throw err;
        setNotice("Account created. If email confirmation is on, check your inbox to finish.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      await router.invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed.");
      return;
    }
    if (result.redirected) return;
    await router.invalidate();
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-border bg-paper p-12 lg:flex">
        <Logo />
        <div>
          <h1 className="text-5xl font-bold leading-[0.95] tracking-tighter">
            Your notes,{" "}
            <span className="relative inline-block">
              <span className="relative z-10">rewired</span>
              <span className="absolute inset-0 -rotate-1 bg-primary opacity-80" />
            </span>{" "}
            for <span className="font-serif italic text-accent">recall.</span>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Summaries, MCQs, flashcards, important questions and viva practice — all generated from
            the material you actually study.
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Exam season ready
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to reach your documents and tools."
              : "Free to start. No card, no setup."}
          </p>

          <button
            onClick={() => void google()}
            className="mt-8 w-full rounded-lg border border-border bg-paper py-3 text-sm font-bold transition-colors hover:bg-secondary"
          >
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              or email
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            {mode === "signup" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-border bg-paper px-3 py-3 text-sm outline-none focus:border-accent"
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@college.edu"
              className="w-full rounded-lg border border-border bg-paper px-3 py-3 text-sm outline-none focus:border-accent"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="Password"
              onKeyDown={(e) => {
                if (e.key === "Enter") void submit();
              }}
              className="w-full rounded-lg border border-border bg-paper px-3 py-3 text-sm outline-none focus:border-accent"
            />
          </div>

          <button
            onClick={() => void submit()}
            disabled={busy || !email || !password}
            className="mt-6 w-full rounded-lg bg-foreground py-3 text-xs font-bold uppercase tracking-widest text-background disabled:opacity-40"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          {error && (
            <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </p>
          )}
          {notice && (
            <p className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-accent">
              {notice}
            </p>
          )}

          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="mt-6 w-full text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent"
          >
            {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
