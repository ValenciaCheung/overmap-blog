import "server-only";
import fs from "node:fs";
import path from "node:path";

export interface ChangelogEntry {
  hash: string;
  shortHash: string;
  date: string;
  author: string;
  subject: string;
  body: string;
  filesChanged: number;
}

const FILE = path.join(process.cwd(), "data", "changelog.json");

export function getAllChangelogEntries(): ChangelogEntry[] {
  if (!fs.existsSync(FILE)) return [];
  const raw = fs.readFileSync(FILE, "utf-8");
  return JSON.parse(raw) as ChangelogEntry[];
}
