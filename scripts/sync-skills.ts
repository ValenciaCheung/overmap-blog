/**
 * Fetch every skill from the official `anthropics/skills` GitHub repo
 * and cache it to `data/skills-cache.json`.
 *
 * Strategy:
 *   1. GitHub Contents API → list directories under `skills/`
 *   2. raw.githubusercontent.com → fetch each `SKILL.md` (no API rate limit)
 *   3. gray-matter → split frontmatter (name + description) from body
 *
 * Usage:
 *   pnpm sync:skills
 *   GITHUB_TOKEN=ghp_xxx pnpm sync:skills   # optional, for higher list limits
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const REPO = "anthropics/skills";
const SKILLS_DIR = "skills";
const CACHE = path.join(process.cwd(), "data", "skills-cache.json");

interface SkillCacheEntry {
  slug: string;
  name: string;
  description: string;
  body: string;
  bodyBytes: number;
  githubUrl: string;
  rawUrl: string;
  directoryUrl: string;
  syncedAt: string;
}

async function listSkillSlugs(): Promise<string[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${SKILLS_DIR}`,
    { headers },
  );
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} listing ${REPO}/${SKILLS_DIR}`);
  }
  const data = (await res.json()) as Array<{ type: string; name: string }>;
  return data
    .filter((e) => e.type === "dir")
    .map((e) => e.name)
    .sort();
}

async function fetchSkill(slug: string): Promise<SkillCacheEntry | null> {
  const rawUrl = `https://raw.githubusercontent.com/${REPO}/main/${SKILLS_DIR}/${slug}/SKILL.md`;
  const res = await fetch(rawUrl);
  if (!res.ok) {
    console.warn(`! ${slug} → HTTP ${res.status}`);
    return null;
  }
  const raw = await res.text();
  const { data, content } = matter(raw);
  const fm = data as { name?: string; description?: string };

  return {
    slug,
    name: fm.name ?? slug,
    description: fm.description ?? "",
    body: content.trim(),
    bodyBytes: raw.length,
    githubUrl: `https://github.com/${REPO}/blob/main/${SKILLS_DIR}/${slug}/SKILL.md`,
    rawUrl,
    directoryUrl: `https://github.com/${REPO}/tree/main/${SKILLS_DIR}/${slug}`,
    syncedAt: new Date().toISOString(),
  };
}

async function main() {
  console.log(`Syncing skills from ${REPO}…`);
  const slugs = await listSkillSlugs();
  console.log(`Found ${slugs.length} skill directories`);

  const results: SkillCacheEntry[] = [];
  for (const slug of slugs) {
    process.stdout.write(`  ${slug} …`);
    try {
      const skill = await fetchSkill(slug);
      if (skill) {
        results.push(skill);
        process.stdout.write(` ${skill.bodyBytes}B\n`);
      } else {
        process.stdout.write(" skip\n");
      }
    } catch (err) {
      process.stdout.write(` error: ${(err as Error).message}\n`);
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  results.sort((a, b) => a.slug.localeCompare(b.slug));
  fs.writeFileSync(CACHE, JSON.stringify(results, null, 2) + "\n");
  console.log(`✓ Wrote ${results.length} skills to ${CACHE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
