// The 3 AM Excuse — make.fun entry.
// One line in the voice of a hardware wallet refusing to sign at 3 AM.
// Writes the line to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "You are sleep-trading again. I refuse to sign until you can spell your seed phrase backwards.";

// Gate: UTF-8 text of 1 to 200 characters, not only white space, single line.
// (Counted by code points so a multi-byte character counts once, as the gate does.)
const chars = [...LINE];
const words = LINE.split(/\s+/).length;
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`line must be 1-200 characters, got ${chars.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only white space");
}
if (LINE !== LINE.trim() || LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line with no leading/trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back check: the file must hold exactly the validated line.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the validated line");
}
console.log(`Wrote ${chars.length} characters, ${words} words, 1 line to ${outPath}`);
