export default function DownloadZine() {
  return (
    <button
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm border border-border rounded-sm
        transition-all hover:border-accent hover:text-accent
        active:bg-accent active:text-bg"
      style={{ fontFamily: "Compagnon, serif", fontWeight: 500 }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 1v9M3.5 6.5 7 10l3.5-3.5M1 13h12" />
      </svg>
      Download Zine
    </button>
  );
}
