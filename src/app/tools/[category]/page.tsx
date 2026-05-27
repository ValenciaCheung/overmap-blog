import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ToolCard } from "@/components/site/tool-card";
import { Badge } from "@/components/ui/badge";
import { JsonLd, breadcrumb } from "@/components/site/json-ld";
import { getAllTools } from "@/lib/tools";
import {
  TOOL_CATEGORIES,
  CATEGORY_LABELS,
  type ToolCategory,
} from "@/lib/tools-meta";
import { CATEGORY_META } from "@/lib/category-meta";
import { siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOL_CATEGORIES.filter((c) => c !== "all").map((c) => ({
    category: c,
  }));
}

function isValidCategory(c: string): c is Exclude<ToolCategory, "all"> {
  return (TOOL_CATEGORIES as readonly string[]).includes(c) && c !== "all";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isValidCategory(category)) return { title: "Not found" };
  const meta = CATEGORY_META[category];
  return {
    title: meta.title,
    description: meta.seoDescription ?? meta.intro,
    openGraph: {
      title: meta.title,
      description: meta.seoDescription ?? meta.intro,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isValidCategory(category)) notFound();
  const meta = CATEGORY_META[category];

  const tools = getAllTools()
    .filter((t) => t.category === category)
    .sort(
      (a, b) =>
        (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
        (b.popularity ?? 0) - (a.popularity ?? 0) ||
        a.name.localeCompare(b.name),
    );

  // Sibling categories for the bottom nav
  const siblings = TOOL_CATEGORIES.filter(
    (c) => c !== "all" && c !== category,
  ) as Exclude<ToolCategory, "all">[];

  const itemListSchema = {
    "@type": "ItemList",
    name: meta.title,
    description: meta.intro,
    numberOfItems: tools.length,
    itemListElement: tools.slice(0, 30).map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: t.url,
      description: t.description,
    })),
  };
  const breadcrumbSchema = breadcrumb([
    { name: "首页", href: "/" },
    { name: "AI 工具", href: "/tools" },
    { name: meta.title, href: `/tools/${category}` },
  ]);

  return (
    <>
      <JsonLd data={[itemListSchema, breadcrumbSchema]} />
      <PageHeader
        eyebrow={
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> 全部工具
          </Link>
        }
        title={`${meta.emoji} ${meta.title}`}
        description={meta.intro}
      >
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">{tools.length} 个工具</Badge>
          {tools.filter((t) => t.badge === "trending" || t.badge === "new")
            .length > 0 && (
            <Badge variant="outline">
              {tools.filter((t) => t.badge === "trending" || t.badge === "new").length}{" "}
              个热门 / 新加入
            </Badge>
          )}
        </div>
      </PageHeader>

      <section className="container-page pb-12">
        {tools.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            这个分类下还没有工具。
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        )}
      </section>

      <section className="container-page pb-16">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          切换分类
        </h2>
        <div className="flex flex-wrap gap-2">
          {siblings.map((c) => (
            <Link
              key={c}
              href={`/tools/${c}`}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {CATEGORY_META[c].emoji} {CATEGORY_LABELS[c]}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
