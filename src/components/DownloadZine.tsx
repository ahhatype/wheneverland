export default function DownloadZine({ slug }: { slug: string }) {
  return (
    <a
      href={`/zines/${slug}.pdf`}
      download
      aria-label="Download zine"
      title="Download zine"
      className="shrink-0 p-1 text-muted transition-colors hover:text-accent"
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
    </a>
  );
}
