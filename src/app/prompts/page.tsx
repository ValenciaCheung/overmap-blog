import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { PromptsExplorer } from "@/components/site/prompts-explorer";
import { getAllPrompts, getPromptCategories } from "@/lib/prompts";

export const metadata: Metadata = {
  title: "提示词库",
  description: "实测过的 AI 提示词集合 —— 内容写作 / 工程 / 设计 / 社交媒体。一键复制即用。",
};

export default function PromptsPage() {
  const prompts = getAllPrompts();
  const categories = getPromptCategories();
  return (
    <>
      <PageHeader
        eyebrow="Prompts"
        title="提示词库"
        description="经过实测的提示词，每条带使用说明、改写思路、坑点。点卡片标题看详细解析，或直接复制开用。"
      />
      <section className="container-page pb-16">
        {prompts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            还没有提示词。把 MDX 放到 <code className="font-mono">content/prompts/</code>。
          </div>
        ) : (
          <PromptsExplorer prompts={prompts} categories={categories} />
        )}
      </section>
    </>
  );
}
