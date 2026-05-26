export const siteConfig = {
  name: "Overmap Blog",
  tagline: "AI 知识 · 工具 · 提示词的集中分发地",
  description:
    "AI 产品设计、提示词工程、Agent Skills、Tech 圈技巧 — 由 Overmap 团队精选并再分发。",
  url: "https://blog.overmap.org",
  mainSite: "https://overmap.org",
  docs: "https://overmap.org/docs",
  github: "https://github.com/overmapai",
  twitter: "https://x.com/overmap_ai",
  nav: [
    { href: "/", label: "首页" },
    { href: "/tools", label: "AI 工具" },
    { href: "/blog", label: "博客" },
    { href: "/hub", label: "Skills Hub" },
    { href: "/prompts", label: "提示词" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
