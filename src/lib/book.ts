import fs from "fs";
import path from "path";
import type { BookMeta, Chapter } from "./types";

const CHAPTERS_DIR = path.join(process.cwd(), "content/chapters");

export function getMeta(): BookMeta {
  const raw = fs.readFileSync(path.join(CHAPTERS_DIR, "meta.json"), "utf-8");
  return JSON.parse(raw) as BookMeta;
}

export function getChapter(slug: string): Chapter | undefined {
  const filePath = path.join(CHAPTERS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Chapter;
}

export function getAllChapters(): Chapter[] {
  const meta = getMeta();
  return meta.chapterOrder
    .map((slug) => getChapter(slug))
    .filter((ch): ch is Chapter => ch !== undefined);
}

export function getAllSlugs(): string[] {
  return getMeta().chapterOrder;
}
