import { Link, createFileRoute } from "@tanstack/react-router";

import { Logo } from "@/components/Logo";
import heroDetail from "@/assets/highlighter-margins.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyGenie AI — Study Smarter with Generative AI" },
      {
        name: "description",
        content:
          "Upload PDFs, PPTs or DOCX notes and StudyGenie AI turns them into summaries, MCQ quizzes, flashcards, important questions and viva practice.",
      },
      { property: "og:title", content: "StudyGenie AI — Study Smarter with Generative AI" },
      {
        property: "og:description",
        content:
          "Turn dense textbooks into high-retention flashcards, quizzes and AI answers in seconds.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: "📖",
    title: "AI Summaries",
    body: "Collapse a 20-page PDF into a short summary, key points, definitions and likely exam questions.",
  },
  {
    icon: "📝",
    title: "MCQ Generator",
    body: "Pick a topic and a question count. StudyGenie writes exam-style MCQs and grades your attempt.",
  },
  {
    icon: "🃏",
    title: "Flashcards",
    body: "Active-recall cards generated straight from your own notes, flippable one at a time.",
  },
  {
    icon: "🎤",
    title: "Viva Mode",
    body: "The AI examines you out loud, question by question, then scores your answers with feedback.",
  },
];

const STEPS = [
  { n: "01", t: "Upload PDF, PPT, DOCX or paste text", d: "StudyGenie extracts every line of text." },
  { n: "02", t: "Your material is indexed", d: "Notes become the source of truth for every answer." },
  { n: "03", t: "Ask, quiz, summarize, revise", d: "Every tool is grounded in your own syllabus." },
  { n: "04", t: "Track exam readiness", d: "Quiz scores build a live progress picture." },
];

const TESTIMONIALS = [
  {
    quote:
      "I fed in six lecture PDFs the night before my OOP paper. The important-questions list predicted four of the eight questions on the exam.",
    name: "Aditi R.",
    role: "CSE, 3rd year",
  },
  {
    quote:
      "Viva mode is brutal in the best way. It kept asking follow-ups until I actually understood polymorphism.",
    name: "Karan M.",
    role: "IT, 2nd year",
  },
  {
    quote:
      "The flashcards come out of my own notes, so nothing feels off-syllabus. My recall went up massively.",
    name: "Sneha P.",
    role: "ECE, final year",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
        <Logo />
        <div className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#voices" className="transition-colors hover:text-foreground">
            Testimonials
          </a>
        </div>
        <Link
          to="/auth"
          className="rounded-full bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest text-background transition-transform active:scale-95"
        >
          Get Started
        </Link>
      </nav>

      <header className="relative mx-auto max-w-7xl overflow-hidden px-6 pb-32 pt-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-block rounded-full border border-accent/20 px-3 py-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
              Exam Season Ready
            </span>
          </div>
          <h1 className="mb-8 text-6xl font-extrabold leading-[0.9] tracking-tighter md:text-8xl">
            Study{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Smarter</span>
              <span className="animate-highlight absolute inset-0 -z-0 -rotate-1 bg-primary opacity-80 [animation-delay:400ms]" />
            </span>{" "}
            with <br />
            <span className="font-serif font-bold italic text-accent">Generative AI.</span>
          </h1>
          <p className="mb-12 max-w-xl text-xl leading-relaxed text-muted-foreground">
            Turn dense textbooks into high-retention flashcards and interactive quizzes in seconds.
            Noise out, knowledge in.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/upload"
              className="group flex items-center gap-3 rounded-lg bg-foreground px-8 py-4 font-bold text-background"
            >
              Upload Your Notes
              <span className="opacity-50 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/ask"
              className="rounded-lg border border-border px-8 py-4 font-bold transition-colors hover:bg-paper"
            >
              Ask StudyGenie
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute right-0 top-20 hidden w-1/3 opacity-20 lg:block">
          <div className="space-y-8 border-l border-foreground/10 pl-8 font-mono text-[10px] uppercase tracking-tighter">
            <div className="space-y-2">
              <div className="h-px w-full bg-foreground/10" />
              <p>Context Analysis: High</p>
            </div>
            <div className="space-y-2">
              <div className="h-px w-full bg-foreground/10" />
              <p>Retention Rate: +42%</p>
            </div>
            <div className="space-y-2">
              <div className="h-px w-full bg-foreground/10" />
              <p>Next Exam: Friday</p>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="border-y border-border bg-paper/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-2 font-mono text-xs font-bold uppercase text-accent">Workspace</h2>
              <h3 className="text-3xl font-bold tracking-tight">Welcome back, Student 👋</h3>
            </div>
            <div className="flex gap-2">
              <span className="size-2 animate-pulse rounded-full bg-accent" />
              <span className="font-mono text-[10px] uppercase text-muted-foreground">
                Active Session
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="grid gap-4 md:grid-cols-2 lg:col-span-8">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-accent"
                >
                  <div
                    className={`mb-6 flex size-10 items-center justify-center rounded-lg ${i % 2 === 0 ? "bg-primary/20" : "bg-accent/10"}`}
                  >
                    <span className="text-lg">{f.icon}</span>
                  </div>
                  <h4 className="mb-2 font-bold">{f.title}</h4>
                  <p className="text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}

              <div className="rounded-xl border border-border bg-background p-6 md:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <h4 className="font-bold">📚 My Documents</h4>
                  <Link
                    to="/documents"
                    className="font-mono text-[10px] font-bold uppercase text-accent underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-2">
                  {[
                    { type: "PDF", name: "Introduction_to_Java_OOP.pdf", meta: "14 Pages", tag: "Ready" },
                    {
                      type: "PPT",
                      name: "Operating_Systems_Lecture_04.pptx",
                      meta: "42 Slides",
                      tag: "Indexed",
                    },
                  ].map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-paper"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 place-items-center rounded bg-secondary text-xs font-bold">
                          {d.type}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{d.name}</p>
                          <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">
                            {d.meta}
                          </p>
                        </div>
                      </div>
                      <span className="rounded bg-primary/20 px-2 py-0.5 font-mono text-[10px]">
                        {d.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl bg-foreground p-8 text-background lg:col-span-4">
              <div className="mb-8 flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-background/60">
                  Active Quiz: Java OOP
                </span>
                <span className="font-mono text-[10px] font-bold uppercase text-primary">
                  Question 1/10
                </span>
              </div>
              <h4 className="mb-8 text-xl font-bold leading-snug">
                What is the primary purpose of Inheritance in Java?
              </h4>
              <div className="flex-grow space-y-3">
                {[
                  "A) To encapsulate data within a single class",
                  "B) To reuse code and establish a hierarchy",
                  "C) To make methods run faster in the JVM",
                  "D) To prevent other classes from accessing variables",
                ].map((o, i) => (
                  <div
                    key={o}
                    className={`w-full rounded-lg p-4 text-left text-sm ${
                      i === 1 ? "border border-primary bg-primary/10" : "border border-background/20"
                    }`}
                  >
                    {o}
                  </div>
                ))}
              </div>
              <Link
                to="/quiz"
                className="mt-8 w-full rounded-lg bg-primary py-4 text-center text-xs font-bold uppercase tracking-widest text-primary-foreground"
              >
                Build my quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how"
        className="mx-auto grid max-w-7xl items-center gap-20 px-6 py-32 md:grid-cols-2"
      >
        <div className="relative">
          <div className="absolute -inset-4 -rotate-2 rounded-3xl border border-accent/10" />
          <img
            src={heroDetail}
            alt="A highlighter sweeping across a page of Java code, leaving a simplified summary card"
            width={1200}
            height={1200}
            loading="lazy"
            className="w-full rounded-2xl outline-1 -outline-offset-1 outline-black/5"
          />
        </div>
        <div>
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
            How it works
          </h2>
          <h3 className="mb-6 text-5xl font-bold leading-tight tracking-tighter">
            Turning noise into <span className="font-serif italic text-accent">clean margins.</span>
          </h3>
          <p className="mb-8 leading-relaxed text-muted-foreground">
            AI shouldn't just summarize; it should prioritize. StudyGenie reads your uploaded
            material, indexes it, and grounds every answer, quiz and flashcard in your own syllabus.
          </p>
          <ol className="space-y-5">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="font-mono text-xs font-bold text-accent">{s.n}</span>
                <div>
                  <p className="text-sm font-bold">{s.t}</p>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="voices" className="border-y border-border bg-paper/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Student voices
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-xl border border-border bg-background p-6">
                <blockquote className="font-serif text-lg italic leading-relaxed">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {t.name} — {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <Logo small />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Built for the focused student. No distractions.
          </p>
          <Link
            to="/auth"
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent"
          >
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
