import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { SkillItem } from "./skills-meta";

export type { SkillItem } from "./skills-meta";
export { SKILLS_REPO, SKILLS_REPO_URL } from "./skills-meta";

const CACHE = path.join(process.cwd(), "data", "skills-cache.json");

export function getAllSkills(): SkillItem[] {
  if (!fs.existsSync(CACHE)) return [];
  const raw = fs.readFileSync(CACHE, "utf-8");
  return JSON.parse(raw) as SkillItem[];
}

export function getSkillBySlug(slug: string): SkillItem | null {
  return getAllSkills().find((s) => s.slug === slug) ?? null;
}

export function getAllSkillSlugs(): string[] {
  return getAllSkills().map((s) => s.slug);
}
