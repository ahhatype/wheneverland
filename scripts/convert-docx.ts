import mammoth from "mammoth";
import fs from "fs";
import path from "path";

const DOCX_DIR = path.join(process.cwd(), "content/docx");
const CHAPTERS_DIR = path.join(process.cwd(), "content/chapters");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const WORD_TO_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
};

function parseChapterNumber(title: string): number | undefined {
  // Try "Chapter <word>" e.g. "Chapter Five"
  const wordMatch = title.match(/chapter\s+(\w+)/i);
  if (wordMatch) {
    const num = WORD_TO_NUM[wordMatch[1].toLowerCase()];
    if (num) return num;
  }
  // Try "Chapter <digit>" e.g. "Chapter 5"
  const digitMatch = title.match(/chapter\s+(\d+)/i);
  if (digitMatch) return parseInt(digitMatch[1], 10);
  return undefined;
}

interface ConvertedChapter {
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  content: string;
}

async function convertFile(filePath: string, chapterNumber: number): Promise<ConvertedChapter[]> {
  console.log(`Converting: ${filePath}`);
  const result = await mammoth.convertToHtml({ path: filePath });

  if (result.messages.length > 0) {
    console.log("Warnings:", result.messages);
  }

  const html = result.value;

  // Split on <h1> tags to detect chapter boundaries
  const parts = html.split(/(?=<h1>)/);
  const chapters: ConvertedChapter[] = [];

  let fallbackNum = chapterNumber;
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Extract title from <h1>
    const titleMatch = trimmed.match(/<h1>(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, "") : `Chapter ${fallbackNum}`;

    // Parse chapter number from h1 title, fall back to sequential
    const num = parseChapterNumber(title) ?? fallbackNum;

    // Remove the <h1> from content since we store title separately
    let content = trimmed.replace(/<h1>.*?<\/h1>/, "").trim();

    // Extract first <h2> as subtitle (chapter name)
    const subtitleMatch = content.match(/<h2>(.*?)<\/h2>/);
    const subtitle = subtitleMatch ? subtitleMatch[1].replace(/<[^>]*>/g, "") : undefined;
    if (subtitleMatch) {
      content = content.replace(/<h2>.*?<\/h2>/, "").trim();
    }

    if (!content) continue;

    const slug = slugify(title);
    chapters.push({ slug, number: num, title, subtitle, content });
    fallbackNum++;
  }

  // If no <h1> found, treat entire doc as one chapter
  if (chapters.length === 0) {
    const fileName = path.basename(filePath, path.extname(filePath));
    chapters.push({
      slug: slugify(fileName),
      number: chapterNumber,
      title: fileName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      content: html,
    });
  }

  // Write individual chapter files
  for (const ch of chapters) {
    const chapterData = {
      slug: ch.slug,
      number: ch.number,
      title: ch.title,
      ...(ch.subtitle ? { subtitle: ch.subtitle } : {}),
      component: `Chapter${ch.number}`,
      content: ch.content,
    };
    const outPath = path.join(CHAPTERS_DIR, `${ch.slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(chapterData, null, 2));
    console.log(`  Wrote: ${outPath}`);
  }

  return chapters;
}

function writeMeta(allSlugs: string[]) {
  const metaPath = path.join(CHAPTERS_DIR, "meta.json");
  let meta = { title: "Wheneverland", author: "Author Name", blurb: "", chapterOrder: [] as string[] };

  if (fs.existsSync(metaPath)) {
    meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  }

  meta.chapterOrder = allSlugs;
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  console.log(`Updated meta.json with ${allSlugs.length} chapters: ${allSlugs.join(", ")}`);
}

async function main() {
  // If a specific file is passed as argument, convert just that one
  // and merge its slug(s) into existing meta
  const targetFile = process.argv[2];

  if (targetFile) {
    const fullPath = path.isAbsolute(targetFile) ? targetFile : path.join(process.cwd(), targetFile);
    const metaPath = path.join(CHAPTERS_DIR, "meta.json");
    let existingOrder: string[] = [];
    if (fs.existsSync(metaPath)) {
      existingOrder = JSON.parse(fs.readFileSync(metaPath, "utf-8")).chapterOrder || [];
    }

    const chapters = await convertFile(fullPath, existingOrder.length + 1);
    const newSlugs = chapters.map((ch) => ch.slug);

    // Merge: add new slugs that aren't already in the order
    for (const slug of newSlugs) {
      if (!existingOrder.includes(slug)) {
        existingOrder.push(slug);
      }
    }
    writeMeta(existingOrder);
    return;
  }

  // Otherwise convert all .docx files in the docx directory
  if (!fs.existsSync(DOCX_DIR)) {
    console.log(`No docx directory found at ${DOCX_DIR}`);
    return;
  }

  const files = fs.readdirSync(DOCX_DIR).filter((f) => f.endsWith(".docx")).sort();
  if (files.length === 0) {
    console.log("No .docx files found in content/docx/");
    return;
  }

  const allChapters: ConvertedChapter[] = [];
  let chapterNum = 1;

  for (const file of files) {
    const chapters = await convertFile(path.join(DOCX_DIR, file), chapterNum);
    allChapters.push(...chapters);
    chapterNum += chapters.length;
  }

  // Sort by chapter number parsed from h1
  allChapters.sort((a, b) => a.number - b.number);
  const allSlugs = allChapters.map((ch) => ch.slug);

  writeMeta(allSlugs);
  console.log("Done.");
}

main().catch(console.error);
