import { notFound } from "next/navigation";
import BookLayout from "@/components/BookLayout";
import ChapterText from "@/components/ChapterText";
import ChapterSidebar from "@/components/ChapterSidebar";
import ChapterNav from "@/components/ChapterNav";
import FloatingNav from "@/components/FloatingNav";
import Placeholder from "@/components/chapters/Placeholder";
import { getChapterComponent } from "@/components/chapters";
import { getChapter, getAllChapters, getAllSlugs } from "@/lib/book";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const chapters = getAllChapters();
  const Component = getChapterComponent(chapter.component);

  return (
    <>
      <BookLayout
        left={
          <>
            <ChapterText chapter={chapter} />
            <ChapterNav chapters={chapters} currentSlug={slug} />
          </>
        }
        right={
          <ChapterSidebar>
            {Component ? <Component /> : <Placeholder title={chapter.title} />}
          </ChapterSidebar>
        }
      />
      <FloatingNav chapters={chapters} currentSlug={slug} />
    </>
  );
}
