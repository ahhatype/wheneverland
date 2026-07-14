"use client";

import { useState, type ReactNode } from "react";

export default function BookLayout({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-screen">
      <div className="px-6 md:px-12 lg:px-16 py-12 lg:py-16">
        {left}
      </div>

      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:overflow-auto border-l border-border bg-surface">
        {right}
      </div>

      {/* Mobile: peek bar at bottom */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border transition-all duration-300 ease-in-out ${
          expanded ? "h-screen" : "h-14"
        }`}
      >
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full h-full flex items-center justify-center text-muted"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 13l6-6 6 6" />
            </svg>
          </button>
        )}
        {expanded && (
          <div className="relative h-full">
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 z-50 p-2 text-muted hover:text-text transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 5l10 10M15 5l-10 10" />
              </svg>
            </button>
            <div className="h-full overflow-auto">
              {right}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
