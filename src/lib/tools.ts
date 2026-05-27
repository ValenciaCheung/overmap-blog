import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { ToolItem } from "./tools-meta";

export type { ToolItem, ToolCategory } from "./tools-meta";
export { TOOL_CATEGORIES, CATEGORY_LABELS, PRICING_LABEL } from "./tools-meta";

const FILE = path.join(process.cwd(), "data", "tools.json");

export function getAllTools(): ToolItem[] {
  if (!fs.existsSync(FILE)) return [];
  const raw = fs.readFileSync(FILE, "utf-8");
  return JSON.parse(raw) as ToolItem[];
}

export function getFeaturedTools(limit = 6): ToolItem[] {
  return getAllTools()
    .filter((t) => t.featured)
    .slice(0, limit);
}

export function getTrendingTools(limit = 6): ToolItem[] {
  return getAllTools()
    .filter((t) => t.badge === "trending" || t.badge === "new")
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, limit);
}
