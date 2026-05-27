import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { getAllPromptSlugs, getPromptBySlug } from "@/lib/prompts";
import { getAllSkillSlugs } from "@/lib/skills";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/hub`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/hub/skills`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/prompts`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
  ];

  const blogPages: MetadataRoute.Sitemap = getAllPostSlugs()
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      return {
        url: `${base}/blog/${slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const promptPages: MetadataRoute.Sitemap = getAllPromptSlugs()
    .map((slug) => {
      const prompt = getPromptBySlug(slug);
      return {
        url: `${base}/prompts/${slug}`,
        lastModified: prompt?.date ? new Date(prompt.date) : now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });

  const skillPages: MetadataRoute.Sitemap = getAllSkillSlugs().map((slug) => ({
    url: `${base}/hub/skills/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...promptPages, ...skillPages];
}
