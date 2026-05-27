import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ToolsExplorer } from "@/components/site/tools-explorer";
import { getAllTools } from "@/lib/tools";
import { TOOL_CATEGORIES, CATEGORY_LABELS, type ToolCategory } from "@/lib/tools-meta";
import { CATEGORY_META } from "@/lib/category-meta";

export const metadata: Metadata = {
  title: "AI 工具库",
  description:
    "编辑挑选的 AI 工具集合,220+ 个 · 15 个场景分类,从对话 / 图像 / 视频到代码 / Agent / 营销。",
};

export default function ToolsPage() {
  const tools = getAllTools();
  const grouped = new Map<ToolCategory, number>();
  for (const t of tools) grouped.set(t.category, (grouped.get(t.category) ?? 0) + 1);
  const categories = TOOL_CATEGORIES.filter((c) => c !== "all") as Exclude<
    ToolCategory,
    "all"
  >[];

  return (
    <>
      <PageHeader
        eyebrow="AI Tools"
        title="AI 工具库"
        description={`${tools.length} 个工具 · 编辑挑选 · 按 15 个场景分类。点下方分类卡片进入专题页,或往下用搜索 / 排序 / 筛选浏览全部。`}
      />

      {/* Category grid as SEO-friendly landing nav */}
      <section className="container-page pb-10">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => {
            const m = CATEGORY_META[c];
            const count = grouped.get(c) ?? 0;
            return (
              <Link
                key={c}
                href={`/tools/${c}`}
                className="group glass-2 rounded-xl p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.emoji}</span>
                    <div>
                      <div className="font-medium text-sm tracking-tight group-hover:text-primary">
                        {CATEGORY_LABELS[c]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {count} 个工具
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-16">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">
          或者在下方筛选 / 搜索全部 {tools.length} 个工具
        </h2>
        <ToolsExplorer tools={tools} />
      </section>
    </>
  );
}
