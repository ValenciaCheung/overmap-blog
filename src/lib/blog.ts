import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogPost } from "./blog-meta";

export type { BlogPost, BlogFrontmatter } from "./blog-meta";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function ensureDir() {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
}

export function getAllPostSlugs(): string[] {
  ensureDir();
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function getPostBySlug(slug: string): BlogPost | null {
  ensureDir();
  const exts = [".mdx", ".md"];
  let filePath: string | null = null;
  for (const ext of exts) {
    const candidate = path.join(BLOG_DIR, `${slug}${ext}`);
    if (fs.existsSync(candidate)) {
      filePath = candidate;
      break;
    }
  }
  if (!filePath) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return {
    slug,
    raw: content,
    title: data.title ?? slug,
    description: data.description,
    date: data.date ?? new Date().toISOString(),
    cover: data.cover,
    tags: data.tags ?? [],
    author: data.author ?? "Overmap",
    video: data.video,
    draft: data.draft ?? false,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
  };
}

export function getAllPosts(): BlogPost[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => Boolean(p) && !p!.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
