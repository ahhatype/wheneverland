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

interface ConvertedChapter {
  slug: string;
  number: number;
  title: string;
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

  let num = chapterNumber;
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Extract title from <h1>
    const titleMatch = trimmed.match(/<h1>(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, "") : `Chapter ${num}`;

    // Remove the <h1> from content since we store title separately
    const content = trimmed.replace(/<h1>.*?<\/h1>/, "").trim();

    if (!content) continue;

    const slug = slugify(title);
    chapters.push({ slug, number: num, title, content });
    num++;
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

  const allSlugs: string[] = [];
  let chapterNum = 1;

  for (const file of files) {
    const chapters = await convertFile(path.join(DOCX_DIR, file), chapterNum);
    for (const ch of chapters) {
      allSlugs.push(ch.slug);
    }
    chapterNum += chapters.length;
  }

  writeMeta(allSlugs);
  console.log("Done.");
}

main().catch(console.error);
