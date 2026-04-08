import BookCover from "@/components/BookCover";
import HomeTOC from "@/components/HomeTOC";
import DownloadZine from "@/components/DownloadZine";
import FloatingNav from "@/components/FloatingNav";
import { getMeta, getAllChapters } from "@/lib/book";

export const dynamic = "force-dynamic";

export default function Home() {
  const meta = getMeta();
  const chapters = getAllChapters();

  return (
    <main className="flex flex-col flex-1 items-center">
      <BookCover meta={meta} />
      <HomeTOC chapters={chapters} />
      <div className="pb-12">
        <DownloadZine />
      </div>
      <FloatingNav chapters={chapters} />
    </main>
  );
}
