export interface Cue {
  /** YouTube video id — the v= param, not the full URL. */
  id: string;
  /** Seconds into the video to start at. */
  start?: number;
  /** Shown in the now-playing chip. */
  title?: string;
}

// Placeholder ids — swap for the real tracks.
export const CUES: Record<string, Cue> = {
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
 *   [[~stairwell| the song ]]   plays in-page
 *   [[>proof| the video ]]      opens YouTube in a new tab
 *
 * Mammoth HTML-escapes `>`, so the sigil arrives as either `>` or `&gt;`.
 */
const CUE_TOKEN = /\[\[\s*(~|>|&gt;)\s*([a-z0-9_-]+)\s*\|([^\]|]+?)\s*\]\]/gi;

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Build-time: rewrite cue tokens in the mammoth HTML into plain, inert markup. */
export function expandCues(html: string, chapterTitle: string): string {
  return html.replace(CUE_TOKEN, (_match, sigil: string, key: string, label: string) => {
    const cue = CUES[key];
    if (!cue) {
      throw new Error(
        `Unknown cue "${key}" in ${chapterTitle}. Add it to src/lib/cues.ts or fix the typo.`,
      );
    }

    const text = escapeHtml(label.trim());
    if (sigil === "~") {
      return `<button type="button" class="cue cue-play" data-cue="${key}">${text}</button>`;
    }
    return `<a class="cue cue-watch" href="${watchUrl(cue)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });
}
