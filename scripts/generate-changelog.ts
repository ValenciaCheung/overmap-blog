/**
 * Generate `data/changelog.json` from `git log`.
 *
 * Each entry = one commit on `main`. Filters out chore / merge commits,
 * keeps only the latest 60 to bound the page size.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

interface ChangelogEntry {
  hash: string;
  shortHash: string;
  date: string;
  author: string;
  subject: string;
  body: string;
  filesChanged: number;
}

const OUTPUT = path.join(process.cwd(), "data", "changelog.json");

function safeGit(args: string): string {
  try {
    return execSync(`git ${args}`, { encoding: "utf-8" }).trimEnd();
  } catch {
    return "";
  }
}

function parseLog(): ChangelogEntry[] {
  // Use a record separator unlikely to appear in commit messages
  const RS = "<<<<<RECORD>>>>>";
  const FS = "<<<<<FIELD>>>>>";
  const format = [
    "%H",
    "%h",
    "%aI",
    "%an",
    "%s",
    "%b",
  ].join(FS);

  const raw = safeGit(
    `log --max-count=80 --no-merges --pretty=format:"${RS}${format}" --shortstat`,
  );
  if (!raw) return [];

  const entries: ChangelogEntry[] = [];
  for (const block of raw.split(RS).filter(Boolean)) {
    const lines = block.split("\n");
    const [hash, shortHash, date, author, subject, ...bodyLines] =
      lines[0].split(FS);
    if (!hash) continue;
    // shortstat appears at the end like "  3 files changed, 99 insertions(+), 12 deletions(-)"
    const statLine = lines.find((l) => /file[s]? changed/.test(l)) ?? "";
    const filesMatch = statLine.match(/(\d+) files? changed/);
    const filesChanged = filesMatch ? Number(filesMatch[1]) : 0;
    const body = bodyLines
      .filter((l) => !/file[s]? changed/.test(l))
      .join("\n")
      .trim();
    entries.push({ hash, shortHash, date, author, subject, body, filesChanged });
  }
  return entries;
}

function main() {
  const entries = parseLog();
  // Drop boring chore-only commits if subject starts with "chore:"
  const filtered = entries.filter(
    (e) =>
      !/^chore\(?[\w-]*\)?:/.test(e.subject) &&
      !/^Merge /.test(e.subject) &&
      !/^Initial commit/.test(e.subject),
  );
  fs.writeFileSync(OUTPUT, JSON.stringify(filtered, null, 2) + "\n");
  console.log(`✓ Wrote ${filtered.length} changelog entries to ${OUTPUT}`);
}

main();
