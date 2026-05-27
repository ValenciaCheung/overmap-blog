/**
 * Build a single search index for the entire site.
 * Output: `public/search-index.json` (~50 KB), loaded by the cmd+K palette.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

interface SearchEntry {
  /** unique id for cmdk */
  id: string;
  /** "tool" | "skill" | "prompt" | "blog" | "page" */
  type: "tool" | "skill" | "prompt" | "blog" | "page";
  title: string;
  description: string;
  href: string;
  /** optional logo / emoji / icon hint */
  hint?: string;
  /** searchable extra keywords */
  keywords?: string[];
}

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "public", "search-index.json");

function readJson<T>(rel: string): T | null {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
}

function readMdxDir(rel: string): { slug: string; data: Record<string, unknown>; content: string }[] {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: f.replace(/\.(mdx|md)$/, ""),
        data,
        content,
      };
    });
}

function main() {
  const entries: SearchEntry[] = [];

  // Static pages
  const pages: SearchEntry[] = [
    { id: "page-home", type: "page", title: "首页", description: "Hero · 最新博客 · 精选工具 · GitHub 精选", href: "/", hint: "🏠" },
    { id: "page-tools", type: "page", title: "AI 工具库", description: "190+ 个 AI 工具,按场景分类,带搜索 / 排序 / 筛选", href: "/tools", hint: "🛠" },
    { id: "page-blog", type: "page", title: "博客", description: "AI 实操笔记 / 视频文字稿 / 对比文 / 行业观察", href: "/blog", hint: "📝" },
    { id: "page-hub", type: "page", title: "Skills Hub", description: "GitHub 开源 AI 项目精选 + Anthropic 官方 Skills", href: "/hub", hint: "🐙" },
    { id: "page-skills", type: "page", title: "Anthropic Skills", description: "anthropics/skills 仓库的所有 SKILL.md 自动同步", href: "/hub/skills", hint: "✨" },
    { id: "page-prompts", type: "page", title: "提示词库", description: "经过实测的 AI 提示词,一键复制即用", href: "/prompts", hint: "💬" },
    { id: "page-changelog", type: "page", title: "Changelog", description: "站点更新历史 · 从 git log 自动生成", href: "/changelog", hint: "📋" },
  ];
  entries.push(...pages);

  // Tools
  const tools = readJson<Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    tags?: string[];
    logo?: string;
  }>>("data/tools.json") ?? [];
  for (const t of tools) {
    entries.push({
      id: `tool-${t.id}`,
      type: "tool",
      title: t.name,
      description: t.description,
      href: `/tools#${t.id}`,
      hint: t.logo,
      keywords: [t.category, ...(t.tags ?? [])],
    });
  }

  // Skills
  const skills = readJson<Array<{
    slug: string;
    name: string;
    description: string;
  }>>("data/skills-cache.json") ?? [];
  for (const s of skills) {
    entries.push({
      id: `skill-${s.slug}`,
      type: "skill",
      title: s.name,
      description: s.description,
      href: `/hub/skills/${s.slug}`,
      hint: "✨",
    });
  }

  // Hub repos
  const repos = readJson<Array<{
    fullName: string;
    description: string;
    note?: string;
    url: string;
    category: string;
  }>>("data/hub-cache.json") ?? [];
  for (const r of repos) {
    entries.push({
      id: `repo-${r.fullName.replace("/", "-")}`,
      type: "tool",
      title: r.fullName,
      description: r.note ?? r.description,
      href: `/hub`,
      hint: "🐙",
      keywords: [r.category, "GitHub"],
    });
  }

  // Prompts
  const prompts = readMdxDir("content/prompts");
  for (const p of prompts) {
    entries.push({
      id: `prompt-${p.slug}`,
      type: "prompt",
      title: (p.data.title as string) ?? p.slug,
      description: (p.data.description as string) ?? "",
      href: `/prompts/${p.slug}`,
      hint: "💬",
      keywords: [
        (p.data.category as string) ?? "",
        ...((p.data.tags as string[]) ?? []),
      ].filter(Boolean),
    });
  }

  // Blog posts
  const posts = readMdxDir("content/blog");
  for (const p of posts) {
    if (p.data.draft) continue;
    entries.push({
      id: `blog-${p.slug}`,
      type: "blog",
      title: (p.data.title as string) ?? p.slug,
      description: (p.data.description as string) ?? "",
      href: `/blog/${p.slug}`,
      hint: "📝",
      keywords: (p.data.tags as string[]) ?? [],
    });
  }

  if (!fs.existsSync(path.dirname(OUTPUT))) {
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  }
  fs.writeFileSync(OUTPUT, JSON.stringify(entries) + "\n");
  const sizeKb = (fs.statSync(OUTPUT).size / 1024).toFixed(1);
  console.log(`✓ Wrote ${entries.length} search entries (${sizeKb} KB) to ${OUTPUT}`);
}

main();
