import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Clock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MdxContent } from "@/components/site/mdx-content";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-page max-w-3xl py-10 md:py-14">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-3.5" />
        返回博客列表
      </Link>

      <header className="mb-8 pb-8 border-b border-border">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <span className="opacity-50">·</span>
          <time dateTime={post.date}>
            {format(new Date(post.date), "yyyy 年 M 月 d 日")}
          </time>
          <span className="opacity-50">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {post.readingMinutes} 分钟阅读
          </span>
          {post.video && (
            <>
              <span className="opacity-50">·</span>
              <a
                href={post.video}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <PlayCircle className="size-3.5" />
                观看原视频
              </a>
            </>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <MdxContent source={post.raw} />
    </article>
  );
}
