import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { HubRepo } from "./hub-meta";

export type { HubRepo, HubCategory } from "./hub-meta";
export { HUB_CATEGORIES, HUB_CATEGORY_LABELS } from "./hub-meta";

const CACHE = path.join(process.cwd(), "data", "hub-cache.json");

export function getAllRepos(): HubRepo[] {
  if (!fs.existsSync(CACHE)) return [];
  const raw = fs.readFileSync(CACHE, "utf-8");
  const parsed = JSON.parse(raw) as HubRepo[];
  return parsed.sort((a, b) => b.stars - a.stars);
}

export function getFeaturedRepos(limit = 3): HubRepo[] {
  return getAllRepos().slice(0, limit);
}
