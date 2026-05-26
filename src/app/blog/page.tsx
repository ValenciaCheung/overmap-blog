import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { BlogCard } from "@/components/site/blog-card";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "博客",
  description: "Overmap Blog 上的 AI 实操笔记 · 视频文字稿 · 行业观察。",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="博客"
        description="AI 实操笔记 · 视频文字稿 · 行业观察。每周更新。"
      />
      <section className="container-page pb-16">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
      还没有发布的文章。把 MDX 放到 <code className="font-mono">content/blog/</code> 即可。
    </div>
  );
}
