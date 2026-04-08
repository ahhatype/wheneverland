import Link from "next/link";
import type { Chapter } from "@/lib/types";

export default function HomeTOC({ chapters }: { chapters: Chapter[] }) {
  return (
    <nav>
      <h2
        className="sr-only"
      >
        Contents
      </h2>
      <ol className="space-y-0">
        {chapters.map((chapter) => (
          <li key={chapter.slug}>
            <Link
              href={`/chapter/${chapter.slug}`}
              className="group flex items-center justify-center gap-4 py-4 transition-colors"
            >
              <span
                className="fancy text-white text-sm tabular-nums group-hover:text-accent-2 transition-colors"
              >
                {String(chapter.number).padStart(2, "0")}
              </span>
              <span className="text-accent group-hover:text-white text-xs translate-y-0.5">&#x2022;</span>
              <span className="text-xl fancy text-accent-2 group-hover:text-accent group-hover:font-medium transition-all">
                {chapter.subtitle || chapter.title}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
