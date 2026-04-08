import type { BookMeta } from "@/lib/types";

export default function BookCover({ meta }: { meta: BookMeta }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <h1
        className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6"
        style={{ fontFamily: "Compagnon, serif" }}
      >
        {meta.title}
      </h1>
      <p className="text-lg text-muted mb-10" style={{ fontFamily: "Compagnon, serif", fontWeight: 300 }}>
        by {meta.author}
      </p>
      <div className="w-16 h-px bg-accent mb-10" />
      <p className="text-xl leading-relaxed max-w-lg text-muted">
        {meta.blurb}
      </p>
    </div>
  );
}
