import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/site/page-header";
import { SkillsExplorer } from "@/components/site/skills-explorer";
import { getAllSkills } from "@/lib/skills";
import { SKILLS_REPO, SKILLS_REPO_URL } from "@/lib/skills-meta";

export const metadata: Metadata = {
  title: "Anthropic Skills · 官方 Skill 索引",
  description: `anthropics/skills 仓库的所有 SKILL.md 自动同步。每个 skill 一页详情 + 一键复制 Claude Code 安装命令。`,
};

export default function SkillsIndex() {
  const skills = getAllSkills();
  const lastSync = skills[0]?.syncedAt;
  return (
    <>
      <PageHeader
        eyebrow={
          <Link
            href="/hub"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> Skills Hub
          </Link>
        }
        title="Anthropic Skills"
        description={`从 ${SKILLS_REPO} 仓库自动同步的 ${skills.length} 个官方 Skill。点卡片看 SKILL.md 全文 + 一键复制 Claude Code 安装命令。`}
      >
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <Badge variant="secondary" className="font-mono">
            <Sparkles className="size-3 mr-1" /> anthropics 官方
          </Badge>
          <a
            href={SKILLS_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            源仓库 <ExternalLink className="size-3" />
          </a>
          {lastSync && (
            <span>
              · 上次同步 {new Date(lastSync).toISOString().slice(0, 10)}
            </span>
          )}
        </div>
      </PageHeader>

      <section className="container-page pb-16">
        {skills.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground space-y-2">
            <p>还没有 skill 缓存。运行下面命令首次同步:</p>
            <pre className="mt-2 inline-block rounded bg-muted px-3 py-1.5 font-mono text-xs">
              pnpm sync:skills
            </pre>
          </div>
        ) : (
          <SkillsExplorer skills={skills} />
        )}
      </section>
    </>
  );
}
