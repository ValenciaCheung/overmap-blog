export interface ToolItem {
  id: string;
  name: string;
  url: string;
  description: string;
  category: ToolCategory;
  tags?: string[];
  pricing?: "free" | "freemium" | "paid";
  featured?: boolean;
  /** New / trending flag for badges */
  badge?: "new" | "trending" | "editors-pick";
  /** Approximate popularity weight (higher = closer to top) */
  popularity?: number;
  logo?: string;
}

/**
 * Top-level categories — modeled after Toolify's taxonomy.
 * Keep `all` first; ordering of the rest determines tab order in the UI.
 */
export const TOOL_CATEGORIES = [
  "all",
  "chat",
  "image",
  "video",
  "audio",
  "code",
  "agent",
  "design",
  "writing",
  "search",
  "productivity",
  "marketing",
  "education",
  "data",
  "3d",
  "business",
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  all: "全部",
  chat: "对话",
  image: "图像",
  video: "视频",
  audio: "音频",
  code: "代码",
  agent: "Agent",
  design: "设计",
  writing: "写作",
  search: "搜索",
  productivity: "效率",
  marketing: "营销",
  education: "教育",
  data: "数据",
  "3d": "3D / 建模",
  business: "商业 / SaaS",
};

export const PRICING_LABEL: Record<"free" | "freemium" | "paid", string> = {
  free: "免费",
  freemium: "免费 + 付费",
  paid: "付费",
};

export const BADGE_LABEL: Record<NonNullable<ToolItem["badge"]>, string> = {
  new: "新",
  trending: "热门",
  "editors-pick": "编辑精选",
};
