export interface HubRepo {
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
  category: HubCategory;
  pushedAt: string;
  syncedAt: string;
}

export const HUB_CATEGORIES = [
  "all",
  "skills",
  "agents",
  "framework",
  "prompts",
  "ui",
  "devtools",
] as const;

export type HubCategory = (typeof HUB_CATEGORIES)[number];

export const HUB_CATEGORY_LABELS: Record<HubCategory, string> = {
  all: "全部",
  skills: "Agent Skills",
  agents: "Agent 框架",
  framework: "AI 框架",
  prompts: "提示词",
  ui: "UI / 组件",
  devtools: "开发工具",
};
