import type { ToolCategory } from "./tools-meta";

/**
 * Per-category landing-page metadata: long-form description for SEO,
 * comparable to what Toolify renders per category root URL.
 */
export interface CategoryMeta {
  title: string;
  /** 1-2 sentence intro that shows above the grid */
  intro: string;
  /** SEO description (≤160 chars). Falls back to `intro` if omitted */
  seoDescription?: string;
  emoji: string;
}

export const CATEGORY_META: Record<Exclude<ToolCategory, "all">, CategoryMeta> = {
  chat: {
    title: "AI 对话 · 通用大模型",
    intro:
      "从 Claude、ChatGPT 到 DeepSeek、Kimi,主流通用 LLM 都在这里。包括多模型聚合(Poe)、垂直陪伴(Replika)与开源端(HuggingChat)。",
    emoji: "💬",
  },
  image: {
    title: "AI 图像生成与编辑",
    intro:
      "覆盖艺术风(Midjourney)、写实风(Flux)、文字渲染(Ideogram)、批量编辑(Photoroom)。设计师 / 营销 / 电商常用工具汇总。",
    emoji: "🎨",
  },
  video: {
    title: "AI 视频生成",
    intro:
      "Sora / Veo / Kling / Hailuo / Pika 旗舰视频模型,加上 Synthesia / HeyGen 数字人、Descript / CapCut 剪辑、Captions 短视频工具。",
    emoji: "🎬",
  },
  audio: {
    title: "AI 音频 · 音乐 · TTS",
    intro:
      "ElevenLabs 语音合成、Suno / Udio 音乐生成、Lalal 音轨分离、Snipd 播客 AI。声音生产全链路。",
    emoji: "🔊",
  },
  code: {
    title: "AI 编程 · IDE · 代码助手",
    intro:
      "Cursor / Claude Code / Copilot / Windsurf / v0 等旗舰 AI IDE 全收录,加上 Aider / Continue 开源选项、Replicate / HuggingFace 部署平台。",
    emoji: "⌘",
  },
  agent: {
    title: "Agent 框架与自主智能体",
    intro:
      "LangChain / AutoGen / CrewAI 等主流 Agent 框架,加上 Devin / OpenHands 自主软件工程 Agent、Manus / Lindy / n8n 编排工具。",
    emoji: "🤖",
  },
  design: {
    title: "AI 设计 · UI / Logo / 图表",
    intro:
      "Figma AI / Galileo / Uizard UI 设计,Whimsical / Mermaid Chart 图表,Looka / Khroma 品牌设计,Recraft 矢量。",
    emoji: "🎯",
  },
  writing: {
    title: "AI 写作 · 翻译 · 编辑",
    intro:
      "Notion AI / Jasper / Grammarly / DeepL 旗舰写作工具,小说创作(Sudowrite)、改写(Wordtune)、长文编辑(Lex / Type)全覆盖。",
    emoji: "✍️",
  },
  search: {
    title: "AI 搜索引擎",
    intro:
      "Perplexity 实时联网 + 引用、Phind 程序员搜索、Exa 语义搜索 API、Consensus 学术研究、Felo 多语言搜索。",
    emoji: "🔍",
  },
  productivity: {
    title: "AI 效率工具 · 会议 / 笔记 / 邮件",
    intro:
      "Granola / Otter / Fathom 会议转写,Motion / Sunsama / Reclaim 日历 AI,Arc / Shortwave / Superhuman 浏览器与邮件 AI,Anytype / Logseq 笔记。",
    emoji: "⚡",
  },
  marketing: {
    title: "AI 营销 · SEO · 销售",
    intro:
      "Clay / Apollo / ZoomInfo B2B 数据,Surfer / Frase / Clearscope SEO 内容,Lavender / Outreach / Lemlist 销售邮件。",
    emoji: "📣",
  },
  education: {
    title: "AI 教育 · 学习",
    intro:
      "Khanmigo / Duolingo Max / MagicSchool / Photomath 主流教育产品,Speak 口语学习、StudyFetch 资料 AI。",
    emoji: "🎓",
  },
  data: {
    title: "AI 数据分析",
    intro:
      "Julius / ChatGPT Code Interpreter 对话式数据分析,Hex / Outerbase 现代 notebook,Snowflake Cortex 数据仓库 AI。",
    emoji: "📊",
  },
  "3d": {
    title: "AI 3D · 建模 · 动作捕捉",
    intro:
      "Meshy / Luma / Tripo / Rodin 文本到 3D,Spline AI 网页 3D,Move AI 动作捕捉,Promethean 游戏场景 AI。",
    emoji: "🧊",
  },
  business: {
    title: "AI 商业 SaaS · 客服 · 法务 · HR",
    intro:
      "Intercom Fin / Ada / Sierra 客服 Agent,Harvey / Spellbook 法务 AI,Paradox / HireVue HR 自动化,Wysa / Calm 健康。",
    emoji: "💼",
  },
};
