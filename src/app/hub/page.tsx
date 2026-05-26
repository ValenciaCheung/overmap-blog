import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { HubExplorer } from "@/components/site/hub-explorer";
import { getAllRepos } from "@/lib/hub";

export const metadata: Metadata = {
  title: "Skills Hub",
  description: "GitHub 上高 star 的 Agent / Prompt / 框架 / UI 仓库聚合，按编辑视角分类。",
};

export default function HubPage() {
  const repos = getAllRepos();
  return (
    <>
      <PageHeader
        eyebrow="Open Source Hub"
        title="Skills Hub"
        description="开源 AI 项目精选：Agent / Prompt / 框架 / UI / 开发工具。数据在构建时通过 GitHub API 抓取。"
      />
      <section className="container-page pb-16">
        {repos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground space-y-2">
            <p>还没有缓存数据。运行下面命令首次同步：</p>
            <pre className="mt-2 inline-block rounded bg-muted px-3 py-1.5 font-mono text-xs">
              pnpm sync:github
            </pre>
          </div>
        ) : (
          <HubExplorer repos={repos} />
        )}
      </section>
    </>
  );
}
