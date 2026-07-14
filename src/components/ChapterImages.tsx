"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const ChapterImageContext = createContext<string | null>(null);

export function useChapterImage(): string | null {
  return useContext(ChapterImageContext);
}

/** Fraction of the viewport height that counts as "the reader is here". */
const READING_LINE = 0.5;

/**
 * Tracks the invisible `[[img:…]]` markers the converter left in the prose and
 * publishes the key of the last one the reader has scrolled past.
 *
 * The markers come from dangerouslySetInnerHTML, so they are inert DOM with no
 * React identity — they have to be found by query, not by ref.
 */
export default function ChapterImages({
  slug,
  defaultKey,
  children,
}: {
  slug: string;
  defaultKey: string | null;
  children: ReactNode;
}) {
  const [key, setKey] = useState<string | null>(defaultKey);

  useEffect(() => {
    setKey(defaultKey);

    const markers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-img]"),
    );
    if (markers.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * READING_LINE;

      let current: string | null = defaultKey;
      for (const marker of markers) {
        if (marker.getBoundingClientRect().top <= line) {
          current = marker.dataset.img ?? current;
        } else {
          break; // markers are in document order, so the rest are below the line
        }
      }
      setKey(current);
    };

    const onScroll = () => {
      if (frame) return; // coalesce to one update per frame
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // Re-scan when the chapter changes: soft nav swaps the prose, not this provider.
  }, [slug, defaultKey]);

  return (
    <ChapterImageContext.Provider value={key}>
      {children}
    </ChapterImageContext.Provider>
  );
}
