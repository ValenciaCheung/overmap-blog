"use client";

import { useMemo, useState } from "react";
import { Search, Rss } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/site/blog-card";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/blog-meta";

export function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("全部");

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) {
      (p.tags ?? []).forEach((t) => set.add(t));
    }
    return ["全部", ...Array.from(set).sort()];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (tag !== "全部" && !(p.tags ?? []).includes(tag)) return false;
      if (!q) return true;
      const hay = [p.title, p.description ?? "", ...(p.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query, tag]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索博客标题、描述、标签"
            className="pl-9"
          />
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <a href="/feed.xml" target="_blank" rel="noreferrer">
            <Rss className="size-3.5" /> RSS
          </a>
        </Button>
        <div className="text-sm text-muted-foreground md:ml-auto">
          {filtered.length} / {posts.length}
        </div>
      </div>

      {tags.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={cn(
                "rounded-md border px-3 py-1 text-xs transition-colors",
                t === tag
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:bg-accent text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          没找到匹配的博客。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
