"use client";

import TOCButton from "./TOCButton";
import DownloadZine from "./DownloadZine";
import type { Chapter } from "@/lib/types";

export default function FloatingNav({
  chapters,
  currentSlug,
}: {
  chapters: Chapter[];
  currentSlug?: string;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <DownloadZine />
      <TOCButton chapters={chapters} currentSlug={currentSlug} />
    </div>
  );
}
