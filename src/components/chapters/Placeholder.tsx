export default function Placeholder({ title }: { title?: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px] border border-dashed border-[var(--muted)] rounded-lg">
      <p className="text-[var(--muted)] text-sm font-[family-name:var(--font-body)]">
        {title ? `Component for "${title}"` : "Chapter component"}
      </p>
    </div>
  );
}
