import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarkdownContent } from "@/components/site/markdown-content";
import { SkillInstall } from "@/components/site/skill-install";
import { JsonLd, breadcrumb, orgSchema } from "@/components/site/json-ld";
import { getAllSkillSlugs, getSkillBySlug } from "@/lib/skills";
import { siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSkillSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return { title: "Not found" };
  return {
    title: `${skill.name} · Anthropic Skill`,
    description: skill.description.slice(0, 200),
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const articleSchema = {
    "@type": "TechArticle",
    headline: skill.name,
    description: skill.description,
    author: { "@type": "Organization", name: "Anthropic", url: "https://www.anthropic.com" },
    publisher: orgSchema,
    image: `${siteConfig.url}/og-image.png`,
    mainEntityOfPage: `${siteConfig.url}/hub/skills/${slug}`,
    inLanguage: "en",
    isBasedOn: skill.githubUrl,
  };
  const breadcrumbSchema = breadcrumb([
    { name: "首页", href: "/" },
    { name: "Skills Hub", href: "/hub" },
    { name: "Anthropic Skills", href: "/hub/skills" },
    { name: skill.name, href: `/hub/skills/${slug}` },
  ]);

  return (
    <article className="container-page max-w-3xl py-10 md:py-14">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <Link
        href="/hub/skills"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-3.5" />
        返回 Skills 索引
      </Link>

      <header className="mb-8">
        <Badge variant="secondary" className="font-mono text-xs">
          anthropics/skills
        </Badge>
        <h1 className="mt-3 font-mono text-3xl md:text-4xl font-semibold tracking-tight">
          {skill.name}
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {skill.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a
            href={skill.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            GitHub 源文件 <ExternalLink className="size-3" />
          </a>
          <a
            href={skill.directoryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            整个 skill 目录 <ExternalLink className="size-3" />
          </a>
        </div>
      </header>

      <SkillInstall slug={skill.slug} />

      <MarkdownContent source={skill.body} />
    </article>
  );
}
