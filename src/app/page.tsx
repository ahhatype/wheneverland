import BookCover from "@/components/BookCover";
import HomeTOC from "@/components/HomeTOC";
import Colophon from "@/components/Colophon";
import { getAllChapters } from "@/lib/book";

export const dynamic = "force-dynamic";

export default function Home() {
  const chapters = getAllChapters();

  return (
    <main className="flex flex-col flex-1 items-center">
      <div className="relative w-full h-screen">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-85 -z-10"
          style={{ backgroundImage: "url('/img/bexley-10-campus-collage.jpg')" }}
        />
        <div className="relative flex items-center justify-center h-full">
          <BookCover />
        </div>
      </div>
      <div className="relative z-10 -mt-[15vh] w-xl mx-auto px-6 py-6 rounded-4xl bg-black/85">
        <HomeTOC chapters={chapters} />
        <p className="text-white fancy text-xs mt-4 w-full text-center">This novel is incomplete. Email <span className="text-cyan-500 no-break">aimeewrightharrison[at]gmail[dot]com</span> if you are interested in an alert.</p>
      </div>
      <div className="relative mx-0 bg-cyan-300/50 w-full -mt-8 px-6 pt-24 pb-8">
        <Colophon />
      </div>
    </main>
  );
}
