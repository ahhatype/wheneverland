"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CUES } from "@/lib/cues";
import { loadYouTubeApi, type YTPlayer } from "@/lib/youtube";

interface Track {
  /** Unique per play, so the same cue can stack on itself. */
  id: number;
  cue: string;
  title: string;
}

/** Fraction of the viewport height a marker must cross to fire. */
const READING_LINE = 0.6;

/** How long to let an unmuted play attempt succeed before assuming it was blocked. */
const AUTOPLAY_GRACE_MS = 1200;

const PLAYING = 1;

export default function Jukebox({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  /** True once a play attempt has been forced muted by the browser. */
  const [needsUnmute, setNeedsUnmute] = useState(false);

  const pathname = usePathname();

  // Players and their DOM nodes live outside React: YT.Player *replaces* the node
  // it is handed with an <iframe>, which React would later try to reconcile.
  const hostRef = useRef<HTMLDivElement>(null);
  const playersRef = useRef(new Map<number, { player: YTPlayer; node: HTMLElement }>());
  const nextIdRef = useRef(1);
  /** Auto markers that have already fired, so scrolling back up cannot re-trigger them. */
  const firedRef = useRef(new Set<Element>());

  const stop = useCallback((id: number) => {
    const entry = playersRef.current.get(id);
    if (entry) {
      entry.player.destroy();
      entry.node.remove();
      playersRef.current.delete(id);
    }
    setTracks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) setNeedsUnmute(false);
      return next;
    });
  }, []);

  const stopAll = useCallback(() => {
    for (const { player, node } of playersRef.current.values()) {
      player.destroy();
      node.remove();
    }
    playersRef.current.clear();
    setTracks([]);
    setNeedsUnmute(false);
  }, []);

  const play = useCallback(
    (cueKey: string) => {
      const cue = CUES[cueKey];
      const host = hostRef.current;
      if (!cue || !host) return;

      // The API is warmed on mount. We never await here: an awaited playVideo()
      // lands outside the click's user-activation window and the browser blocks it.
      const YT = window.YT;
      if (!YT?.Player) return;

      const id = nextIdRef.current++;

      const slot = document.createElement("div");
      slot.className = "jukebox-slot";
      const mount = document.createElement("div");
      slot.appendChild(mount);
      host.appendChild(slot);

      const player = new YT.Player(mount, {
        videoId: cue.id,
        width: 200,
        height: 113,
        playerVars: {
          autoplay: 1,
          start: cue.start ?? 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (e) => {
            // Go for sound. This succeeds for readers the browser already trusts
            // (they've interacted with the site before); everyone else gets blocked.
            e.target.unMute();
            e.target.playVideo();

            window.setTimeout(() => {
              if (!playersRef.current.has(id)) return; // stopped in the meantime
              if (e.target.getPlayerState() === PLAYING && !e.target.isMuted()) return;

              // Blocked. Fall back to a silent play and ask for a click.
              e.target.mute();
              e.target.playVideo();
              setNeedsUnmute(true);
            }, AUTOPLAY_GRACE_MS);
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) stop(id);
          },
        },
      });

      playersRef.current.set(id, { player, node: slot });
      setTracks((prev) => [...prev, { id, cue: cueKey, title: cue.title ?? cueKey }]);
    },
    [stop],
  );

  const unmuteAll = useCallback(() => {
    for (const { player } of playersRef.current.values()) {
      player.unMute();
      player.playVideo();
    }
    setNeedsUnmute(false);
  }, []);

  // Warm the API well before the first cue.
  useEffect(() => {
    loadYouTubeApi();
  }, []);

  // Any click anywhere counts as the gesture that lets sound through — this is
  // what makes a blocked track quietly become audible without the reader ever
  // pressing an unmute button.
  useEffect(() => {
    if (!needsUnmute) return;
    const onGesture = () => unmuteAll();
    document.addEventListener("click", onGesture);
    document.addEventListener("keydown", onGesture);
    return () => {
      document.removeEventListener("click", onGesture);
      document.removeEventListener("keydown", onGesture);
    };
  }, [needsUnmute, unmuteAll]);

  // Delegated on `document`, not on the prose container: the chapter subtree is
  // swapped out on navigation, but the Jukebox lives in the root layout and is
  // never unmounted. The cue buttons come from dangerouslySetInnerHTML, so they
  // are inert DOM with no React handlers.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.<HTMLElement>("[data-cue]");
      if (!el) return;
      const cueKey = el.dataset.cue;
      if (!cueKey) return;
      e.preventDefault();
      play(cueKey);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [play]);

  // Invisible auto-cue markers: reaching one in the prose starts its track.
  // Re-scanned per route, since soft nav swaps the chapter beneath us.
  useEffect(() => {
    const markers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cue-auto]"),
    );
    if (markers.length === 0) return;

    let frame = 0;
    const check = () => {
      frame = 0;
      const line = window.innerHeight * READING_LINE;
      for (const marker of markers) {
        if (firedRef.current.has(marker)) continue;
        if (marker.getBoundingClientRect().top > line) break; // in document order
        firedRef.current.add(marker);
        const key = marker.dataset.cueAuto;
        if (key) play(key);
      }
    };

    const onScroll = () => {
      if (frame) return; // coalesce to one check per frame
      frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname, play]);

  useEffect(() => stopAll, [stopAll]);

  return (
    <>
      {children}

      <div
        className={`fixed top-4 right-4 z-50 max-w-[min(240px,calc(100vw-2rem))] ${
          tracks.length === 0 ? "invisible" : ""
        }`}
      >
        <div className="border border-border bg-surface/95 backdrop-blur-sm shadow-lg p-2">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span
              className="fancy text-[10px] uppercase tracking-[0.2em] text-accent"
              style={{ fontWeight: 500 }}
            >
              Now playing
              {tracks.length > 1 ? ` ×${tracks.length}` : ""}
            </span>
            <button
              type="button"
              onClick={stopAll}
              aria-label="Stop all"
              className="fancy text-[10px] uppercase tracking-[0.15em] text-muted hover:text-accent transition-colors"
            >
              &#x2715;
            </button>
          </div>

          {/* Players are appended here imperatively — React must never own these nodes. */}
          <div ref={hostRef} className="flex flex-col gap-1.5" />

          {needsUnmute && (
            <button
              type="button"
              onClick={unmuteAll}
              className="fancy mt-1.5 w-full text-[10px] uppercase tracking-[0.15em] text-bg bg-accent py-1 transition-opacity hover:opacity-80"
            >
              Tap for sound
            </button>
          )}

          <ul className="mt-1.5 space-y-0.5">
            {tracks.map((track) => (
              <li key={track.id} className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] text-muted truncate">{track.title}</span>
                <button
                  type="button"
                  onClick={() => stop(track.id)}
                  aria-label={`Stop ${track.title}`}
                  className="shrink-0 text-[11px] text-muted hover:text-accent transition-colors"
                >
                  &#x2715;
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
