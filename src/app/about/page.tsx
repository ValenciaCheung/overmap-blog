import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { siteConfig } from "@/lib/site";
import { getAllTools } from "@/lib/tools";
import { getAllSkills } from "@/lib/skills";
import { getAllPosts } from "@/lib/blog";
import { getAllPrompts } from "@/lib/prompts";

export const metadata: Metadata = {
  title: "关于",
  description: "Overmap Blog 是什么 — 团队、内容来源、投稿方式、技术栈。",
};

export default function AboutPage() {
  const counts = {
    tools: getAllTools().length,
    skills: getAllSkills().length,
    posts: getAllPosts().length,
    prompts: getAllPrompts().length,
  };

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="关于 Overmap Blog"
        description="一个面向 AI 时代内容生产者、工程师、设计师的精选导航 + 知识分发站。"
      />

      <article className="container-page max-w-3xl pb-16 prose-overmap">
        <h2>这个站是什么</h2>
        <p>
          Overmap Blog 是{" "}
          <a href={siteConfig.mainSite} target="_blank" rel="noreferrer">
            overmap.org
          </a>{" "}
          的二级域名内容生态。主站是 AI API 网关产品(基于 new-api fork),这里
          是配套的内容站,做三件事:
        </p>
        <ul>
          <li>
            <strong>编辑精选 AI 工具</strong> —— 已收录 <b>{counts.tools}</b> 个
            ,按 15 个场景分类。不刷量、不收 SEO 长尾费,每个都是真用过 / 主流社区认可。
          </li>
          <li>
            <strong>Skills + Prompts 库</strong> —— 从 Anthropic 官方
            <code>anthropics/skills</code> 仓库自动同步 <b>{counts.skills}</b> 个 Skill,
            + 编辑实测的 <b>{counts.prompts}</b> 条提示词模板。
          </li>
          <li>
            <strong>视频文字稿 / 行业观察博客</strong> —— 累计 <b>{counts.posts}</b> 篇,
            重点写"我们怎么用、谁更适合、有什么坑",而不是工具评分榜。
          </li>
        </ul>

        <h2>跟其他 AI 导航站有什么不一样</h2>
        <p>
          市面上 AI 工具站很多,大多走的是"全量索引 + LLM 改写文案 + SEO 长尾"
          路线 —— 比如 Toolify 的 <b>20w+</b> 工具页 90% 是机器生成的水分。
        </p>
        <p>
          Overmap Blog 走相反方向:<strong>精选编辑</strong>。
        </p>
        <ul>
          <li>每个工具都人工审过、标了定价 / 分类 / 状态(new / trending / editors-pick)</li>
          <li>每个 Prompt 都实测过,带使用说明 + 改写思路 + 坑点</li>
          <li>每篇博客都是真实工作流,不是 ChatGPT 写完直接发</li>
        </ul>

        <h2>内容来源</h2>
        <ul>
          <li>
            <strong>AI 工具</strong> —— 编辑人工整理(基于日常使用 + 社区共识)。数据在
            <code>data/tools.json</code>,完全公开可以提 PR 加新工具。
          </li>
          <li>
            <strong>Skills</strong> —— 构建时自动从{" "}
            <a
              href="https://github.com/anthropics/skills"
              target="_blank"
              rel="noreferrer"
            >
              anthropics/skills
            </a>{" "}
            仓库拉 <code>SKILL.md</code>。Anthropic 更新,我们自动跟。
          </li>
          <li>
            <strong>GitHub 项目</strong> —— 编辑挑种子仓库写到{" "}
            <code>data/hub-seeds.json</code>,构建时通过 GitHub API 抓 star / topic / 描述。
          </li>
          <li>
            <strong>博客 + Prompts</strong> —— 编辑写,MDX 格式,完全在仓库里管理。
          </li>
        </ul>

        <h2>技术栈(给好奇的人)</h2>
        <ul>
          <li>Next.js 16 App Router + React 19 + TypeScript</li>
          <li>Tailwind CSS v4 + shadcn/ui(radix-nova 风格,跟主站对齐)</li>
          <li>MDX(博客)/ next-mdx-remote(prompt 详情)/ remark+rehype(skill 渲染)</li>
          <li>构建时静态导出 → Cloudflare Workers Static Assets</li>
          <li>cmd+K 全站搜索 / RSS feed / sitemap / changelog 全 build-time 生成</li>
          <li>
            源码:{" "}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
            >
              github.com/overmap-blog
            </a>
          </li>
        </ul>

        <h2>如何投稿 / 贡献</h2>
        <ol>
          <li>
            <strong>推荐 AI 工具</strong> —— 直接 PR 改 <code>data/tools.json</code>
          </li>
          <li>
            <strong>推荐 GitHub 项目</strong> —— PR 改 <code>data/hub-seeds.json</code>
          </li>
          <li>
            <strong>投稿 Prompt 模板</strong> —— 在 <code>content/prompts/</code> 加 MDX 文件,作者会署名
          </li>
          <li>
            <strong>投稿博客</strong> —— 在 <code>content/blog/</code> 加 MDX 文件
          </li>
        </ol>

        <h2>联系</h2>
        <p>
          有合作 / 反馈 / 想聊聊 AI 的事,直接 Open an issue 或邮件。我们没有客服系统,
          但每条都会看。
        </p>
      </article>

      <section className="container-page max-w-3xl pb-16">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild>
            <a href={siteConfig.github} target="_blank" rel="noreferrer" className="gap-1.5">
              <Code2 className="size-4" /> GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/changelog">看 Changelog</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href={siteConfig.mainSite} target="_blank" rel="noreferrer">
              访问主站 <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="secondary" className="font-normal">编辑视角</Badge>
          <Badge variant="secondary" className="font-normal">无 cookie 追踪</Badge>
          <Badge variant="secondary" className="font-normal">完全开源</Badge>
          <Badge variant="secondary" className="font-normal">每天自动更新</Badge>
        </div>
      </section>
    </>
  );
}
