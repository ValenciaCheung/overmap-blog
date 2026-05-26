"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/site/tool-card";
import {
  CATEGORY_LABELS,
  TOOL_CATEGORIES,
  type ToolCategory,
  type ToolItem,
} from "@/lib/tools-meta";
import { cn } from "@/lib/utils";

export function ToolsExplorer({ tools }: { tools: ToolItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (!q) return true;
      const hay = [
        t.name,
        t.description,
        ...(t.tags ?? []),
        t.category,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [tools, query, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索工具名、关键词、标签"
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground md:ml-auto">
          {filtered.length} / {tools.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TOOL_CATEGORIES.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={c === category ? "default" : "outline"}
            className={cn("h-8")}
            onClick={() => setCategory(c)}
          >
            {CATEGORY_LABELS[c]}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          没找到匹配的工具。换个关键词试试。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      )}
    </div>
  );
}
