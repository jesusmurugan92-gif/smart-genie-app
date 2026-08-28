import { Link } from "@tanstack/react-router";

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span
        className={`${small ? "size-6" : "size-8"} flex items-center justify-center rounded bg-foreground`}
      >
        <span className={`${small ? "size-2" : "size-3"} rounded-full bg-primary`} />
      </span>
      <span
        className={`font-mono font-bold uppercase tracking-tighter ${small ? "text-sm" : "text-lg"}`}
      >
        StudyGenie<span className="text-accent">.AI</span>
      </span>
    </Link>
  );
}
