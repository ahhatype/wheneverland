export interface BookImage {
  /** Path under /public. */
  src: string;
  /** Required — this is read aloud when the sidebar image changes. */
  alt: string;
  /** Optional line shown beneath the image. */
  caption?: string;
}

export const IMAGES: Record<string, BookImage> = {
  "mit-stairs": {
    src: "/img/mit-stairs.jpg",
    alt: "A concrete stairwell with pipe railings, flooded in hot pink",
    caption: "Stairs to MIT tunnels",
  },
  "simmons-snow-shift": {
    src: "/img/simmons-snow-shift.jpg",
    alt: "Simmons Hall in deep snow, its grid of windows color-shifted to magenta and acid green against a blank white field",
    caption: "Simmons, in snow",
  },
  "fire-extinguisher": {
    src: "/img/fire-extinguisher.jpg",
    alt: "Three red fire extinguishers lying on a white bedsheet, the image color-shifted to bleeding magenta and green",
    caption: "Fire extinguisher",
  },
  bexley: {
    src: "/img/bexleyhall.jpg",
    alt: "Bexley Hall",
    caption: "Bexley Hall",
  },
  collage: {
    src: "/img/bexley-10-campus-collage.jpg",
    alt: "A collage of campus photographs",
    caption: "Campus, ten ways",
  },
};

/**
 * What sits in the sidebar when a chapter opens, before the reader has
 * scrolled past any [[img:…]] marker. Keyed by chapter slug.
 */
export const CHAPTER_DEFAULT_IMAGE: Record<string, string> = {
  "chapter-one": "mit-stairs",
  "chapter-two": "collage",
  "chapter-three": "bexley",
  "chapter-four": "collage",
  "chapter-five": "bexley",
};

export function getImage(key: string): BookImage | undefined {
  return IMAGES[key];
}

/**
 * The images a chapter can actually show: its default plus every marker in the
 * prose, in document order. Only these get mounted, so adding images to the
 * registry never costs other chapters a download.
 */
export function imageKeysIn(content: string, slug: string): string[] {
  const keys: string[] = [];
  const fallback = CHAPTER_DEFAULT_IMAGE[slug];
  if (fallback && IMAGES[fallback]) keys.push(fallback);

  for (const match of content.matchAll(/data-img="([a-z0-9_-]+)"/gi)) {
    const key = match[1];
    if (IMAGES[key] && !keys.includes(key)) keys.push(key);
  }
  return keys;
}

/**
 * Invisible image markers, authored in Word as a bare token on its own:
 *
 *   ...we climbed to the third floor. [[img:bexley]] Nadine was there.
 *
 * The reader never sees it; scrolling past it swaps the sidebar image.
 */
const IMG_TOKEN = /\[\[\s*img:\s*([a-z0-9_-]+)\s*\]\]/gi;

export function expandImageCues(html: string, chapterTitle: string): string {
  const expanded = html.replace(IMG_TOKEN, (_match, key: string) => {
    if (!IMAGES[key]) {
      throw new Error(
        `Unknown image "${key}" in ${chapterTitle}. Add it to src/lib/images.ts or fix the typo.`,
      );
    }
    return `<span class="img-cue" data-img="${key}" aria-hidden="true"></span>`;
  });

  // A marker written on its own line in Word arrives as its own <p>, which would
  // leave an empty paragraph's worth of blank space in the prose. Unwrap it: the
  // marker keeps its position in the scroll, but takes up no room.
  return expanded.replace(
    /<p[^>]*>\s*((?:<span class="img-cue"[^>]*><\/span>\s*)+)<\/p>/g,
    "$1",
  );
}
