"use client";

import { useState, useRef, useEffect } from "react";
import TOCPopover from "./TOCPopover";
import type { Chapter } from "@/lib/types";

export default function TOCButton({
  chapters,
  currentSlug,
}: {
  chapters: Chapter[];
  currentSlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex flex-col items-end gap-3">
      {open && (
        <TOCPopover
          chapters={chapters}
          currentSlug={currentSlug}
          onSelect={() => setOpen(false)}
        />
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 flex items-center justify-center border border-border bg-bg
          text-xs uppercase tracking-[0.1em] transition-all duration-300 ease-out
          hover:border-accent hover:text-accent"
        style={{
          fontFamily: "Compagnon, serif",
          fontWeight: 700,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
        }}
        aria-label="Table of Contents"
      >
        TOC
      </button>
    </div>
  );
}
