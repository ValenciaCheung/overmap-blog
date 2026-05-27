import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { HubExplorer } from "@/components/site/hub-explorer";
import { getAllRepos } from "@/lib/hub";
import { getAllSkills } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Skills Hub",
  description:
    "GitHub 上高 star 的 Agent / Prompt / 框架 / UI 仓库聚合 + anthropics/skills 官方 Skill 索引。",
};

export default function HubPage() {
  const repos = getAllRepos();
  const skills = getAllSkills();
  return (
    <>
      <PageHeader
        eyebrow="Open Source Hub"
        title="Skills Hub"
        description="开源 AI 项目精选：Agent / Prompt / 框架 / UI / 开发工具。数据在构建时通过 GitHub API 抓取。"
      />

      {/* Anthropic Skills 入口卡片 */}
      <section className="container-page mb-10">
        <Link href="/hub/skills" className="group block">
          <div className="glass-3 rounded-2xl p-6 md:p-8 transition-colors hover:border-primary/40">
            <div className="flex items-start gap-5">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Wand2 className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Sparkles className="size-3" />
                  Anthropic 官方
                </div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight group-hover:text-primary">
                  Anthropic Skills · {skills.length} 个官方 Skill
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  从 <code className="font-mono">anthropics/skills</code> 仓库自动同步 SKILL.md
                  全文。每条带"如何在 Claude Code 用"的一键复制命令（degit / curl /
                  sparse-checkout 三种安装方式）。
                </p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
            </div>
          </div>
        </Link>
      </section>

      <section className="container-page pb-16">
        <div className="mb-4 text-sm text-muted-foreground">
          以下是按编辑视角挑选的开源仓库
        </div>
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
