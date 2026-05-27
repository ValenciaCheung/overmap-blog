export const siteConfig = {
  name: "Overmap Blog",
  tagline: "AI 知识 · 工具 · 提示词的集中分发地",
  description:
    "AI 产品设计、提示词工程、Agent Skills、Tech 圈技巧 — 由 Overmap 团队精选并再分发。",
  url: "https://blog.overmap.org",
  mainSite: "https://overmap.org",
  docs: "https://overmap.org/docs",
  github: "https://github.com/ValenciaCheung",
  twitter: "https://x.com/overmap_ai",
  /**
   * Top-level nav. `labelKey` is an i18next dotted path. `label` is the
   * Chinese fallback used by server components that can't call `t()`.
   */
  nav: [
    { href: "/", labelKey: "nav.home", label: "首页" },
    { href: "/tools", labelKey: "nav.tools", label: "AI 工具" },
    { href: "/blog", labelKey: "nav.blog", label: "博客" },
    { href: "/hub", labelKey: "nav.skillsHub", label: "Skills Hub" },
    { href: "/prompts", labelKey: "nav.prompts", label: "提示词" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
