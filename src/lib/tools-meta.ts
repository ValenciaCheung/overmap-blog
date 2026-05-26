export interface ToolItem {
  id: string;
  name: string;
  url: string;
  description: string;
  category: ToolCategory;
  tags?: string[];
  pricing?: "free" | "freemium" | "paid";
  featured?: boolean;
  logo?: string;
}

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
};

export const PRICING_LABEL: Record<"free" | "freemium" | "paid", string> = {
  free: "免费",
  freemium: "免费 + 付费",
  paid: "付费",
};
