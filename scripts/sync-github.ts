/**
 * Fetch GitHub metadata for repos listed in data/hub-seeds.json
 * and write the result to data/hub-cache.json.
 *
 * Usage:
 *   pnpm sync:github
 *   # or with a token for higher rate limits:
 *   GITHUB_TOKEN=ghp_xxx pnpm sync:github
 */

import fs from "node:fs";
import path from "node:path";

interface Seed {
  fullName: string;
  category: string;
  note?: string;
}

interface Repo {
  fullName: string;
  url: string;
  description: string;
  stars: number;
  language: string | null;
  topics: string[];
  owner: string;
  ownerAvatar: string;
  homepage: string | null;
  note?: string;
  category: string;
  pushedAt: string;
  syncedAt: string;
}

const ROOT = process.cwd();
const SEEDS_PATH = path.join(ROOT, "data", "hub-seeds.json");
const CACHE_PATH = path.join(ROOT, "data", "hub-cache.json");

async function fetchRepo(seed: Seed): Promise<Repo | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/repos/${seed.fullName}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.warn(`! ${seed.fullName} → HTTP ${res.status} (${res.statusText})`);
    return null;
  }
  const data = (await res.json()) as Record<string, unknown>;

  return {
    fullName: seed.fullName,
    url: data.html_url as string,
    description: (data.description as string) ?? "",
    stars: (data.stargazers_count as number) ?? 0,
    language: (data.language as string) ?? null,
    topics: ((data.topics as string[]) ?? []).slice(0, 6),
    owner: (data.owner as { login?: string })?.login ?? seed.fullName.split("/")[0],
    ownerAvatar:
      (data.owner as { avatar_url?: string })?.avatar_url ??
      `https://github.com/${seed.fullName.split("/")[0]}.png`,
    homepage: (data.homepage as string) || null,
    note: seed.note,
    category: seed.category,
    pushedAt: (data.pushed_at as string) ?? new Date().toISOString(),
    syncedAt: new Date().toISOString(),
  };
}

async function main() {
  if (!fs.existsSync(SEEDS_PATH)) {
    console.error(`Seeds file not found: ${SEEDS_PATH}`);
    process.exit(1);
  }
  const seeds = JSON.parse(fs.readFileSync(SEEDS_PATH, "utf-8")) as Seed[];

  console.log(`Syncing ${seeds.length} repos…`);
  const results: Repo[] = [];
  for (const seed of seeds) {
    process.stdout.write(`  ${seed.fullName} …`);
    const repo = await fetchRepo(seed);
    if (repo) {
      results.push(repo);
      process.stdout.write(` ★ ${repo.stars}\n`);
    } else {
      process.stdout.write(" skip\n");
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  results.sort((a, b) => b.stars - a.stars);
  fs.writeFileSync(CACHE_PATH, JSON.stringify(results, null, 2) + "\n");
  console.log(`✓ Wrote ${results.length} repos to ${CACHE_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
