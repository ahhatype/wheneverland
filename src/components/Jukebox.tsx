"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CUES } from "@/lib/cues";
import { loadYouTubeApi, type YTPlayer } from "@/lib/youtube";

interface Track {
  /** Unique per play, so the same cue can stack on itself. */
  id: number;
  cue: string;
  title: string;
}

export default function Jukebox({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);

  // Players and their DOM nodes live outside React: YT.Player *replaces* the node
  // it is handed with an <iframe>, which React would later try to reconcile.
  const hostRef = useRef<HTMLDivElement>(null);
  const playersRef = useRef(new Map<number, { player: YTPlayer; node: HTMLElement }>());
  const nextIdRef = useRef(1);

  const stop = useCallback((id: number) => {
    const entry = playersRef.current.get(id);
    if (entry) {
      entry.player.destroy();
      entry.node.remove();
      playersRef.current.delete(id);
    }
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const stopAll = useCallback(() => {
    for (const { player, node } of playersRef.current.values()) {
      player.destroy();
      node.remove();
    }
    playersRef.current.clear();
    setTracks([]);
  }, []);

  const play = useCallback((cueKey: string) => {
    const cue = CUES[cueKey];
    const host = hostRef.current;
    if (!cue || !host) return;

    // The API is warmed on mount; if it somehow is not ready we skip rather than
    // await, because an awaited playVideo() lands outside the click's user-activation
    // window and the browser blocks the audio.
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
      width: 160,
      height: 90,
      playerVars: {
        autoplay: 1,
        start: cue.start ?? 0,
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (e) => {
          e.target.unMute();
          e.target.playVideo();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) stop(id);
        },
      },
    });

    playersRef.current.set(id, { player, node: slot });
    setTracks((prev) => [...prev, { id, cue: cueKey, title: cue.title ?? cueKey }]);
  }, [stop]);

  // Warm the API well before the first click.
  useEffect(() => {
    loadYouTubeApi();
  }, []);

  // Delegated on `document`, not on the prose container: the chapter subtree is
  // swapped out on navigation, but this listener (and the Jukebox) live in the
  // root layout and are never unmounted. The cue buttons come from
  // dangerouslySetInnerHTML, so they are inert DOM with no React handlers.
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

  useEffect(() => stopAll, [stopAll]);

  return (
    <>
      {children}

      <div
        className={`fixed bottom-20 lg:bottom-6 left-6 z-50 max-w-[min(340px,calc(100vw-3rem))] ${
          tracks.length === 0 ? "invisible" : ""
        }`}
      >
        <div className="border border-border bg-surface/95 backdrop-blur-sm shadow-lg p-3">
          <div className="flex items-center justify-between gap-4 mb-2">
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
              className="fancy text-[10px] uppercase tracking-[0.15em] text-muted hover:text-accent transition-colors"
            >
              Stop all
            </button>
          </div>

          {/* Players are appended here imperatively — React must never own these nodes. */}
          <div ref={hostRef} className="flex flex-wrap gap-2" />

          <ul className="mt-2 space-y-0.5">
            {tracks.map((track) => (
              <li key={track.id} className="flex items-baseline justify-between gap-3">
                <span className="text-xs text-muted truncate">{track.title}</span>
                <button
                  type="button"
                  onClick={() => stop(track.id)}
                  aria-label={`Stop ${track.title}`}
                  className="shrink-0 text-xs text-muted hover:text-accent transition-colors"
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
