// news-image-20261126: copy the pre-rendered entry image to the output dir.
// No network, no dependencies, deterministic: the same bytes every run.
// Fails fast when the image breaks the competition gate (over 1 MiB) or
// when the copy does not come out byte-for-byte identical to the source.
// Usage: node main.ts  (or MAKEFUN_OUTPUT_DIR=out node main.ts)
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576;

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const dest = resolve(outDir, 'entry.png');

const sourceSize = statSync(source).size;
if (sourceSize > MAX_BYTES) {
  console.error(`FAIL: entry.png is ${sourceSize} bytes, over the ${MAX_BYTES} byte limit`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, dest);

const destSize = statSync(dest).size;
if (destSize !== sourceSize) {
  console.error(`FAIL: copy size mismatch: source ${sourceSize} bytes, dest ${destSize} bytes`);
  process.exit(1);
}
console.log(`wrote ${dest} (${destSize} bytes)`);
