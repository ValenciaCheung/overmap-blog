"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Newspaper,
  Wrench,
  Code2,
  Flame,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeHero } from "@/components/site/home-hero";
import { BlogCard } from "@/components/site/blog-card";
import { ToolCard } from "@/components/site/tool-card";
import { RepoCard } from "@/components/site/repo-card";
import { PromptCard } from "@/components/site/prompt-card";
import type { BlogPost } from "@/lib/blog-meta";
import type { ToolItem } from "@/lib/tools-meta";
import type { HubRepo } from "@/lib/hub-meta";
import type { PromptItem } from "@/lib/prompts-meta";

export interface HomeFeedProps {
  stats: {
    tools: number;
    skills: number;
    repos: number;
    posts: number;
    prompts: number;
  };
  latestPosts: BlogPost[];
  featuredTools: ToolItem[];
  trendingTools: ToolItem[];
  featuredRepos: HubRepo[];
  featuredPrompts: PromptItem[];
}

export function HomeFeed({
  stats,
  latestPosts,
  featuredTools,
  trendingTools,
  featuredRepos,
  featuredPrompts,
}: HomeFeedProps) {
  const { t } = useTranslation();

  return (
    <div className="pb-12">
      <HomeHero stats={stats} />
      <div className="container-page">
        <div className="h-px bg-border/70" />
      </div>

      <FeedSection
        eyebrow={t("home.trendingEyebrow")}
        title={t("home.trendingTitle")}
        href="/tools"
        icon={<Flame className="size-4" />}
        viewAllLabel={t("home.viewAll")}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trendingTools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </FeedSection>

      <FeedSection
        eyebrow={t("home.latestBlogEyebrow")}
        title={t("home.latestBlogTitle")}
        href="/blog"
        icon={<Newspaper className="size-4" />}
        viewAllLabel={t("home.viewAll")}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {latestPosts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </FeedSection>

      <FeedSection
        eyebrow={t("home.featuredToolsEyebrow")}
        title={t("home.featuredToolsTitle")}
        href="/tools"
        icon={<Wrench className="size-4" />}
        viewAllLabel={t("home.viewAll")}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </FeedSection>

      <FeedSection
        eyebrow={t("home.promptsEyebrow")}
        title={t("home.promptsTitle")}
        href="/prompts"
        icon={<MessageSquare className="size-4" />}
        viewAllLabel={t("home.viewAll")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {featuredPrompts.map((p) => (
            <PromptCard key={p.slug} prompt={p} />
          ))}
        </div>
      </FeedSection>

      <FeedSection
        eyebrow={t("home.hubEyebrow")}
        title={t("home.hubTitle")}
        href="/hub"
        icon={<Code2 className="size-4" />}
        viewAllLabel={t("home.viewAll")}
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

function FeedSection({
  eyebrow,
  title,
  href,
  icon,
  children,
  viewAllLabel,
}: {
  eyebrow: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  viewAllLabel: string;
}) {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            {icon}
            {eyebrow}
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {title}
          </h2>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link
            href={href}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            {viewAllLabel} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
      {children}
    </section>
  );
}

function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="container-page py-12 md:py-16">
      <div className="glass-3 rounded-2xl p-8 md:p-12 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {t("home.ctaTitle")}
        </h3>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          {t("home.ctaSubtitle")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <a
              href="https://github.com/ValenciaCheung"
              target="_blank"
              rel="noreferrer"
            >
              {t("home.ctaGithub")}
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://overmap.org" target="_blank" rel="noreferrer">
              {t("home.ctaMain")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
