import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { ToolsExplorer } from "@/components/site/tools-explorer";
import { getAllTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "AI 工具库",
  description: "编辑挑选的 AI 工具集合：Chat / 图像 / 视频 / 音频 / 代码 / Agent / 设计 / 写作 / 搜索。",
};

export default function ToolsPage() {
  const tools = getAllTools();
  return (
    <>
      <PageHeader
        eyebrow="AI Tools"
        title="AI 工具库"
        description="编辑挑选 · 按场景分类 · 一键跳转。建议把这页加入收藏夹。"
      />
      <section className="container-page pb-16">
        <ToolsExplorer tools={tools} />
      </section>
    </>
  );
}
