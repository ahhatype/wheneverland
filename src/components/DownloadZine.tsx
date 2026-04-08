export default function DownloadZine({ slug }: { slug: string }) {
  return (
    <a
      href={`/zines/${slug}.pdf`}
      download
      className="fixed top-4 left-4 z-50 inline-flex items-center gap-1.5 px-3 py-1.5
        text-xs text-muted border border-border rounded-sm bg-bg/80 backdrop-blur-sm
        transition-all hover:text-accent hover:border-accent"
      style={{ fontFamily: "Compagnon, serif", fontWeight: 500 }}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 1v9M3.5 6.5 7 10l3.5-3.5M1 13h12" />
      </svg>
      Zine
    </a>
  );
}
