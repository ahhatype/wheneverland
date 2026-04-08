import Link from "next/link";
import type { Chapter } from "@/lib/types";

export default function ChapterNav({
  chapters,
  currentSlug,
}: {
  chapters: Chapter[];
  currentSlug: string;
}) {
  const currentIndex = chapters.findIndex((c) => c.slug === currentSlug);
  const prev = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <nav className="flex justify-between items-center pt-12 mt-12 border-t border-border">
      {prev ? (
        <Link
          href={`/chapter/${prev.slug}`}
          className="group flex flex-col gap-1 text-left hover:text-accent transition-colors"
        >
          <span className="text-xs text-muted uppercase tracking-wider">Previous</span>
          <span className="text-sm">{prev.title}</span>
        </Link>
      ) : (
        <Link
          href="/"
          className="group flex flex-col gap-1 text-left hover:text-accent transition-colors"
        >
          <span className="text-xs text-muted uppercase tracking-wider">Back</span>
          <span className="text-sm">Home</span>
        </Link>
      )}
      {next ? (
        <Link
          href={`/chapter/${next.slug}`}
          className="group flex flex-col gap-1 text-right hover:text-accent transition-colors"
        >
          <span className="text-xs text-muted uppercase tracking-wider">Next</span>
          <span className="text-sm">{next.title}</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
