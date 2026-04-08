import type { ReactNode } from "react";

export default function ChapterSidebar({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center p-6 lg:p-8 min-h-[300px] lg:min-h-0 h-full">
      {children}
    </div>
  );
}
