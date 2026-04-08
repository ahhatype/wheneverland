import Markdown from "react-markdown";
import type { Chapter } from "@/lib/types";

export default function ChapterText({ chapter }: { chapter: Chapter }) {
  return (
    <article>
      <div className="mb-4">
        <span
          className="text-sm text-muted tracking-[0.15em] uppercase"
          style={{ fontFamily: "Compagnon, serif", fontWeight: 500 }}
        >
          Chapter {String(chapter.number).padStart(2, "0")}
        </span>
      </div>
      <h1 className="chapter-title">{chapter.title}</h1>
      <div className="prose-book">
        <Markdown>{chapter.content}</Markdown>
      </div>
    </article>
  );
}
