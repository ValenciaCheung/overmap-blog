import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/site/copy-button";
import { MdxContent } from "@/components/site/mdx-content";
import { JsonLd, breadcrumb, orgSchema } from "@/components/site/json-ld";
import { getAllPromptSlugs, getPromptBySlug } from "@/lib/prompts";
import { siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPromptSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) return { title: "Not found" };
  return {
    title: prompt.title,
    description: prompt.description,
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) notFound();

  const articleSchema = {
    "@type": "Article",
    headline: prompt.title,
    description: prompt.description,
    datePublished: prompt.date,
    dateModified: prompt.date,
    author: { "@type": "Person", name: prompt.author ?? "Overmap Team" },
    publisher: orgSchema,
    image: `${siteConfig.url}/og-image.png`,
    mainEntityOfPage: `${siteConfig.url}/prompts/${slug}`,
    articleSection: prompt.category,
    keywords: (prompt.tags ?? []).join(", "),
    inLanguage: "zh-CN",
  };
  const breadcrumbSchema = breadcrumb([
    { name: "首页", href: "/" },
    { name: "提示词", href: "/prompts" },
    { name: prompt.title, href: `/prompts/${slug}` },
  ]);

  return (
    <article className="container-page max-w-3xl py-10 md:py-14">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <Link
        href="/prompts"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-3.5" />
        返回提示词库
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="font-normal">{prompt.category}</Badge>
          {prompt.model && <span>· {prompt.model}</span>}
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
          {prompt.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{prompt.description}</p>
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {prompt.tags.map((t) => (
              <Badge key={t} variant="outline" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <section className="rounded-xl border border-border bg-card p-5 mb-10">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">提示词</h2>
          <CopyButton text={prompt.prompt} label="复制提示词" size="sm" />
        </div>
        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed font-mono text-foreground/90">
          {prompt.prompt}
        </pre>
      </section>

      <Separator className="my-8" />

      <MdxContent source={prompt.body} />
    </article>
  );
}
