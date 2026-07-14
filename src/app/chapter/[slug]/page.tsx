import { notFound } from "next/navigation";
import BookLayout from "@/components/BookLayout";
import ChapterText from "@/components/ChapterText";
import ChapterSidebar from "@/components/ChapterSidebar";
import ChapterNav from "@/components/ChapterNav";
import ChapterImages from "@/components/ChapterImages";
import ImageStage from "@/components/ImageStage";
import FloatingNav from "@/components/FloatingNav";
import { CHAPTER_DEFAULT_IMAGE, imageKeysIn } from "@/lib/images";
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
  const imageKeys = imageKeysIn(chapter.content, slug);
  const defaultImage = CHAPTER_DEFAULT_IMAGE[slug] ?? null;

  return (
    <>
      <ChapterImages slug={slug} defaultKey={defaultImage}>
        <BookLayout
          left={
            <>
              <ChapterText chapter={chapter} />
              <ChapterNav chapters={chapters} currentSlug={slug} />
            </>
          }
          right={
            <ChapterSidebar>
              <ImageStage keys={imageKeys} />
            </ChapterSidebar>
          }
        />
      </ChapterImages>
      <FloatingNav chapters={chapters} currentSlug={slug} />
    </>
  );
}
