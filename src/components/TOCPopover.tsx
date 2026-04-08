import Link from "next/link";
import type { Chapter } from "@/lib/types";

export default function TOCPopover({
  chapters,
  currentSlug,
  onSelect,
}: {
  chapters: Chapter[];
  currentSlug?: string;
  onSelect: () => void;
}) {
  return (
    <div className="bg-bg border border-border p-4 min-w-[200px] max-w-[280px] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
      <p
        className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3"
        style={{ fontFamily: "Compagnon, serif", fontWeight: 500 }}
      >
        Chapters
      </p>
      <ol className="space-y-1">
        {chapters.map((chapter) => {
          const isActive = chapter.slug === currentSlug;
          return (
            <li key={chapter.slug}>
              <Link
                href={`/chapter/${chapter.slug}`}
                onClick={onSelect}
                className={`flex items-baseline gap-3 py-1.5 text-sm transition-colors hover:text-accent ${
                  isActive ? "text-accent" : ""
                }`}
              >
                <span className="text-[10px] text-muted tabular-nums" style={{ fontFamily: "Compagnon, serif" }}>
                  {String(chapter.number).padStart(2, "0")}
                </span>
                <span>{chapter.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
