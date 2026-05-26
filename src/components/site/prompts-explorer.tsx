"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/site/prompt-card";
import type { PromptItem } from "@/lib/prompts-meta";

export function PromptsExplorer({
  prompts,
  categories,
}: {
  prompts: PromptItem[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("全部");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      if (category !== "全部" && p.category !== category) return false;
      if (!q) return true;
      const hay = [
        p.title,
        p.description,
        p.prompt,
        ...(p.tags ?? []),
        p.category,
        p.model ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [prompts, query, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索提示词内容、标签、模型"
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground md:ml-auto">
          {filtered.length} / {prompts.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={c === category ? "default" : "outline"}
            className="h-8"
            onClick={() => setCategory(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          没找到匹配的提示词。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((p) => (
            <PromptCard key={p.slug} prompt={p} />
          ))}
        </div>
      )}
    </div>
  );
}
