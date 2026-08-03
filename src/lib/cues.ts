export interface Cue {
  /** YouTube video id — the v= param, not the full URL. */
  id: string;
  /** Seconds into the video to start at. */
  start?: number;
  /** Shown in the now-playing chip. */
  title?: string;
}

export const CUES: Record<string, Cue> = {
  "ice-of-boston": {
    id: "p5dt_tJsqLc",
    title: "The Ice of Boston — The Dismemberment Plan",
  },
  // Placeholder ids — swap for real tracks.
  stairwell: { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up" },
  proof: { id: "9bZkp7q19f0", title: "Gangnam Style" },
};

export function getCue(key: string): Cue | undefined {
  return CUES[key];
}

export function watchUrl(cue: Cue): string {
  const url = new URL("https://www.youtube.com/watch");
  url.searchParams.set("v", cue.id);
  if (cue.start) url.searchParams.set("t", `${cue.start}s`);
  return url.toString();
}

/**
 * Inline cue tokens, authored in Word as:
 *   [[~stairwell| the song ]]   the reader clicks these words to play
 *   [[>proof| the video ]]      opens YouTube in a new tab
 *   [[~stairwell]]              no label: invisible, plays on its own
 *
 * Mammoth HTML-escapes `>`, so the sigil arrives as either `>` or `&gt;`.
 */
const CUE_TOKEN = /\[\[\s*(~|>|&gt;)\s*([a-z0-9_-]+)\s*\|([^\]|]+?)\s*\]\]/gi;

/** The label-less form: scrolling to it starts the track, unprompted. */
const AUTO_CUE_TOKEN = /\[\[\s*~\s*([a-z0-9_-]+)\s*\]\]/gi;

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function requireCue(key: string, chapterTitle: string): Cue {
  const cue = CUES[key];
  if (!cue) {
    throw new Error(
      `Unknown cue "${key}" in ${chapterTitle}. Add it to src/lib/cues.ts or fix the typo.`,
    );
  }
  return cue;
}

/** Build-time: rewrite cue tokens in the mammoth HTML into plain, inert markup. */
export function expandCues(html: string, chapterTitle: string): string {
  // Labelled cues first, so their `|text|` part can't be mistaken for a bare key.
  const withLabelled = html.replace(
    CUE_TOKEN,
    (_match, sigil: string, key: string, label: string) => {
      const cue = requireCue(key, chapterTitle);
      const text = escapeHtml(label.trim());
      if (sigil === "~") {
        return `<button type="button" class="cue cue-play" data-cue="${key}">${text}</button>`;
      }
      return `<a class="cue cue-watch" href="${watchUrl(cue)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
  );

  const withAuto = withLabelled.replace(AUTO_CUE_TOKEN, (_match, key: string) => {
    requireCue(key, chapterTitle);
    return `<span class="cue-auto" data-cue-auto="${key}" aria-hidden="true"></span>`;
  });

  // A marker on its own line in Word arrives as its own <p>; unwrap it so it
  // holds its place in the scroll without leaving a blank gap in the prose.
  return withAuto.replace(
    /<p[^>]*>\s*((?:<span class="cue-auto"[^>]*><\/span>\s*)+)<\/p>/g,
    "$1",
  );
}
