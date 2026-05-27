/**
 * Generate `public/feed.xml` (RSS 2.0) from all non-draft blog posts.
 *
 * Runs as part of `prebuild`. Output is a flat static file so it works
 * with `output: "export"` on Cloudflare Workers Static Assets.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  body: string;
}

const SITE_URL = "https://blog.overmap.org";
const SITE_TITLE = "Overmap Blog";
const SITE_DESCRIPTION =
  "AI 产品设计、提示词工程、Agent Skills、Tech 圈技巧 — 由 Overmap 团队精选并再分发。";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const OUTPUT = path.join(process.cwd(), "public", "feed.xml");

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function readPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
      const { data, content } = matter(raw);
      if (data.draft) return null;
      return {
        slug: f.replace(/\.(mdx|md)$/, ""),
        title: data.title ?? f,
        description: data.description ?? "",
        date: data.date ?? new Date().toISOString(),
        author: data.author ?? "Overmap",
        body: content,
      } as PostMeta;
    })
    .filter((p): p is PostMeta => Boolean(p))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function renderItem(post: PostMeta): string {
  const link = `${SITE_URL}/blog/${post.slug}`;
  // Plain-text excerpt: first 400 chars of body
  const excerpt = post.body
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/[#*_`>[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>noreply@overmap.org (${escapeXml(post.author)})</author>
      <description>${escapeXml(post.description || excerpt)}</description>
      <content:encoded><![CDATA[<p>${post.description || excerpt}</p><p><a href="${link}">在 ${SITE_TITLE} 阅读全文 →</a></p>]]></content:encoded>
    </item>`;
}

function main() {
  const posts = readPosts();
  const latest = posts[0]?.date ?? new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${posts.map(renderItem).join("\n")}
  </channel>
</rss>
`;

  if (!fs.existsSync(path.dirname(OUTPUT))) {
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  }
  fs.writeFileSync(OUTPUT, xml);
  console.log(`✓ Wrote feed with ${posts.length} entries to ${OUTPUT}`);
}

main();
