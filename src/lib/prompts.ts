import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { PromptItem } from "./prompts-meta";

export type { PromptItem, PromptFrontmatter } from "./prompts-meta";

const DIR = path.join(process.cwd(), "content", "prompts");

function ensureDir() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
}

export function getAllPromptSlugs(): string[] {
  ensureDir();
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function getPromptBySlug(slug: string): PromptItem | null {
  ensureDir();
  const exts = [".mdx", ".md"];
  let filePath: string | null = null;
  for (const ext of exts) {
    const candidate = path.join(DIR, `${slug}${ext}`);
    if (fs.existsSync(candidate)) {
      filePath = candidate;
      break;
    }
  }
  if (!filePath) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    body: content,
    title: data.title ?? slug,
    description: data.description ?? "",
    prompt: data.prompt ?? "",
    category: data.category ?? "其他",
    tags: data.tags ?? [],
    model: data.model,
    author: data.author ?? "Overmap",
    date: data.date,
  };
}

export function getAllPrompts(): PromptItem[] {
  return getAllPromptSlugs()
    .map((slug) => getPromptBySlug(slug))
    .filter((p): p is PromptItem => Boolean(p));
}

export function getPromptCategories(): string[] {
  const set = new Set<string>();
  for (const p of getAllPrompts()) set.add(p.category);
  return ["全部", ...Array.from(set).sort()];
}
