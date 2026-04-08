import Link from "next/link";
import type { Chapter } from "@/lib/types";

export default function HomeTOC({ chapters }: { chapters: Chapter[] }) {
  return (
    <nav className="max-w-lg mx-auto w-full px-6 pb-20">
      <h2
        className="text-sm uppercase tracking-[0.2em] text-muted mb-8 text-center"
        style={{ fontFamily: "Compagnon, serif", fontWeight: 500 }}
      >
        Contents
      </h2>
      <ol className="space-y-0">
        {chapters.map((chapter) => (
          <li key={chapter.slug}>
            <Link
              href={`/chapter/${chapter.slug}`}
              className="group flex items-baseline gap-4 py-4 border-b border-border transition-colors hover:border-accent"
            >
              <span
                className="text-sm text-muted tabular-nums group-hover:text-accent transition-colors"
                style={{ fontFamily: "Compagnon, serif" }}
              >
                {String(chapter.number).padStart(2, "0")}
              </span>
              <span className="text-xl group-hover:text-accent transition-colors">
                {chapter.title}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Colophon */}
      <footer className="mt-16 pt-8 border-t border-border text-xs text-muted leading-relaxed">
        <h3
          className="uppercase tracking-[0.2em] mb-4"
          style={{ fontFamily: "Compagnon, serif", fontWeight: 500 }}
        >
          Colophon
        </h3>
        <p className="mb-3">
          Headings and display type set in{" "}
          <a
            href="https://velvetyne.fr/fonts/compagnon/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Compagnon
          </a>
          , designed by Juliette Duh&eacute;, L&eacute;a Pradine, Valentin Papon,
          Chlo&eacute; Lozano &amp; S&eacute;bastien Riollier at EESAB-Rennes,
          Typography Creation Studio, Master Graphic Design, 2018.
        </p>
        <p className="mb-3">
          Light &amp; Roman by Duh&eacute; &amp; Pradine. Italic by Papon.
          Medium by Riollier. Script by Lozano Yegge.
        </p>
        <p className="mb-3">
          Published by{" "}
          <a
            href="https://velvetyne.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Velvetyne
          </a>
          , a libre font foundry. Made in France, made in Brittany.
        </p>
        <p className="text-muted/60">
          Licensed under the{" "}
          <a
            href="https://openfontlicense.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            SIL Open Font License, Version 1.1
          </a>
          . Body text set in Source Sans 3.
        </p>
      </footer>
    </nav>
  );
}
