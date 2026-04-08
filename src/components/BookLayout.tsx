import type { ReactNode } from "react";

export default function BookLayout({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-screen">
      <div className="px-6 md:px-12 lg:px-16 py-12 lg:py-16">
        {left}
      </div>
      <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-auto border-t lg:border-t-0 lg:border-l border-border bg-surface">
        {right}
      </div>
    </div>
  );
}
