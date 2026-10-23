#!/usr/bin/env node
// Fails the build if student data or real photos look like they were added to this PUBLIC repository.
// Run locally with: npm run check:privacy   (also runs first in the GitHub Actions workflow)
import {readdirSync, statSync} from "node:fs";
import {extname, join, relative} from "node:path";

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", "out", "build", ".remotion"]);

const BLOCKED_EXTENSIONS = new Set([".xlsx", ".xls", ".csv", ".sav", ".heic", ".heif"]);
const BLOCKED_DIR_NAMES = new Set(["private", "student-data", "students", "student-photos", "photos"]);
const BLOCKED_NAME_PATTERN = /(student|students|طالب|طالبات|roster|grades|marks|attendance|كشف)/i;
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".mov"]);

const problems = [];

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(ROOT, full);
    const stats = statSync(full);

    if (stats.isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      if (BLOCKED_DIR_NAMES.has(entry.toLowerCase())) {
        problems.push(`${rel}/  → folder name suggests student data/photos`);
        continue;
      }
      walk(full);
      continue;
    }

    const ext = extname(entry).toLowerCase();
    if (BLOCKED_EXTENSIONS.has(ext)) {
      problems.push(`${rel}  → ${ext} files (spreadsheets / phone photos) are not allowed in this repo`);
    } else if (IMAGE_EXTENSIONS.has(ext) && BLOCKED_NAME_PATTERN.test(entry)) {
      problems.push(`${rel}  → media file whose name suggests students`);
    }
  }
};

walk(ROOT);

if (problems.length > 0) {
  console.error("Privacy check FAILED. Do not publish student data or real photos in a public repository:\n");
  for (const p of problems) console.error("  - " + p);
  console.error("\nKeep such material in a private location and use illustrations / synthetic data in videos.");
  process.exit(1);
}
console.log("Privacy check passed: no student-data files or student photos detected.");
