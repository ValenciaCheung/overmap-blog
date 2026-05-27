"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroStats {
  tools: number;
  skills: number;
  repos: number;
  posts: number;
  prompts: number;
}

export function HomeHero({ stats }: { stats: HeroStats }) {
  const { t } = useTranslation();
  const items = [
    { label: t("hero.stats.tools"), value: stats.tools, href: "/tools" },
    { label: t("hero.stats.skills"), value: stats.skills, href: "/hub/skills" },
    { label: t("hero.stats.repos"), value: stats.repos, href: "/hub" },
    { label: t("hero.stats.posts"), value: stats.posts, href: "/blog" },
    { label: t("hero.stats.prompts"), value: stats.prompts, href: "/prompts" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 fade-bottom-lg">
        <div className="absolute inset-x-0 top-0 h-96 bg-radial from-primary/10 via-primary/5 to-transparent" />
      </div>
      <div className="container-page pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-4 animate-appear">
            <Sparkles className="size-3 mr-1" /> {t("hero.badge")}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight animate-appear animation-delay-100">
            {t("hero.title1")}
            <br className="hidden md:block" />
            <span className="text-primary">{t("hero.title2")}</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl animate-appear animation-delay-300">
            {t("hero.subtitle")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3 animate-appear animation-delay-700">
            <Button asChild size="lg">
              <Link href="/blog" className="gap-1">
                {t("hero.ctaBlog")} <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tools">{t("hero.ctaTools")}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/hub" className="gap-1">
                <Brain className="size-4" /> {t("hero.ctaHub")}
              </Link>
            </Button>
          </div>
        </div>

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
