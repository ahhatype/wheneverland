import { watch } from "chokidar";
import { execSync } from "child_process";
import path from "path";

const DOCX_DIR = path.join(process.cwd(), "content/docx");

console.log(`Watching for .docx changes in ${DOCX_DIR}...`);

const watcher = watch("**/*.docx", {
  cwd: DOCX_DIR,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 1000,
    pollInterval: 100,
  },
});

function convert(filePath: string) {
  const fullPath = path.join(DOCX_DIR, filePath);
  console.log(`\nDetected change: ${filePath}`);
  try {
    execSync(`npx tsx scripts/convert-docx.ts "${fullPath}"`, {
      cwd: process.cwd(),
      stdio: "inherit",
    });
    console.log("Conversion complete. Next.js should hot-reload.");
  } catch (err) {
    console.error("Conversion failed:", err);
  }
}

watcher.on("add", convert);
watcher.on("change", convert);

process.on("SIGINT", () => {
  watcher.close();
  process.exit(0);
});
