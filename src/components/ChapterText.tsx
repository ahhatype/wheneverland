import type { Chapter } from "@/lib/types";

export default function ChapterText({ chapter }: { chapter: Chapter }) {
  return (
    <article>
      <div className="mb-4">
        <span
          className="text-sm fancy font-medium text-muted tracking-[0.15em] uppercase"
        >
          Chapter {String(chapter.number).padStart(2, "0")}
        </span>
      </div>
      <h1 className="chapter-title">{chapter.subtitle || chapter.title}</h1>
      <div
        className="prose-book"
        dangerouslySetInnerHTML={{ __html: chapter.content }}
      />
    </article>
  );
}
