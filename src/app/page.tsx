import Link from "next/link";
import { ArrowRight, Sparkles, Newspaper, Wrench, Code2, Brain, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/site/blog-card";
import { ToolCard } from "@/components/site/tool-card";
import { RepoCard } from "@/components/site/repo-card";
import { getAllPosts } from "@/lib/blog";
import { getAllTools, getFeaturedTools, getTrendingTools } from "@/lib/tools";
import { getAllRepos, getFeaturedRepos } from "@/lib/hub";
import { getAllSkills } from "@/lib/skills";
import { getAllPrompts } from "@/lib/prompts";

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);
  const featuredTools = getFeaturedTools(6);
  const trendingTools = getTrendingTools(6);
  const featuredRepos = getFeaturedRepos(3);
  const stats = {
    tools: getAllTools().length,
    skills: getAllSkills().length,
    repos: getAllRepos().length,
    posts: getAllPosts().length,
    prompts: getAllPrompts().length,
  };

  return (
    <div className="pb-12">
      <Hero stats={stats} />
      <SectionDivider />

      <FeedSection
        eyebrow="本月热门 · Trending"
        title="社区刚火起来的 AI 工具"
        href="/tools"
        icon={<Flame className="size-4" />}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trendingTools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </FeedSection>

      <FeedSection
        eyebrow="最新博客"
        title="视频文字稿与 AI 实操笔记"
        href="/blog"
        icon={<Newspaper className="size-4" />}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {latestPosts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </FeedSection>

      <FeedSection
        eyebrow="精选工具"
        title="AI 工具库 · 编辑挑选"
        href="/tools"
        icon={<Wrench className="size-4" />}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </FeedSection>

      <FeedSection
        eyebrow="Skills Hub"
        title="GitHub 开源精选"
        href="/hub"
        icon={<Code2 className="size-4" />}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {featuredRepos.map((r) => (
            <RepoCard key={r.fullName} repo={r} />
          ))}
        </div>
      </FeedSection>

      <CTASection />
    </div>
  );
}

interface HeroStats {
  tools: number;
  skills: number;
  repos: number;
  posts: number;
  prompts: number;
}

function Hero({ stats }: { stats: HeroStats }) {
  const items = [
    { label: "AI 工具", value: stats.tools, href: "/tools" },
    { label: "官方 Skills", value: stats.skills, href: "/hub/skills" },
    { label: "GitHub 精选", value: stats.repos, href: "/hub" },
    { label: "博客", value: stats.posts, href: "/blog" },
    { label: "Prompts", value: stats.prompts, href: "/prompts" },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 fade-bottom-lg">
        <div className="absolute inset-x-0 top-0 h-96 bg-radial from-primary/10 via-primary/5 to-transparent" />
      </div>
      <div className="container-page pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-4 animate-appear">
            <Sparkles className="size-3 mr-1" /> Overmap 二级域名 · 内容生态
          </Badge>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight animate-appear animation-delay-100">
            AI 知识 · 工具 · 提示词的
            <br className="hidden md:block" />
            <span className="text-primary">集中分发地</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl animate-appear animation-delay-300">
            我们把高 star 的开源 Agent、用得顺手的 AI 工具、调试过的提示词、视频内容文字稿汇总到一起 —— 用编辑视角再分发。
          </p>
          <div className="mt-7 flex flex-wrap gap-3 animate-appear animation-delay-700">
            <Button asChild size="lg">
              <Link href="/blog" className="gap-1">
                浏览博客 <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tools">看看 AI 工具库</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/hub" className="gap-1">
                <Brain className="size-4" /> Skills Hub
              </Link>
            </Button>
          </div>
        </div>

        {/* Stat bar */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5 max-w-3xl animate-appear animation-delay-1000">
          {items.map((it) => (
            <Link
              key={it.label}
              href={it.href}
              className="group glass-2 rounded-xl px-4 py-3 transition-colors hover:border-primary/40"
            >
              <div className="font-mono text-2xl font-semibold tracking-tight tabular-nums group-hover:text-primary">
                {it.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {it.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionDivider() {
  return (
    <div className="container-page">
      <div className="h-px bg-border/70" />
    </div>
  );
}

function FeedSection({
  eyebrow,
  title,
  href,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            {icon}
            {eyebrow}
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link
            href={href}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            查看全部 <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
      {children}
    </section>
  );
}

function CTASection() {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="glass-3 rounded-2xl p-8 md:p-12 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
          有好东西推荐？
        </h3>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          欢迎把你日常在用的 AI 工具 / 开源仓库 / 提示词投稿给我们。经过编辑筛选后会署名收录。
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <a href="https://github.com/overmapai" target="_blank" rel="noreferrer">
              提交到 GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://overmap.org" target="_blank" rel="noreferrer">
              访问 Overmap 主站
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
