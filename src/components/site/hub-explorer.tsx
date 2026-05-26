"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RepoCard } from "@/components/site/repo-card";
import {
  HUB_CATEGORIES,
  HUB_CATEGORY_LABELS,
  type HubCategory,
  type HubRepo,
} from "@/lib/hub-meta";

export function HubExplorer({ repos }: { repos: HubRepo[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<HubCategory>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repos.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (!q) return true;
      const hay = [
        r.fullName,
        r.description,
        r.note ?? "",
        ...(r.topics ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [repos, query, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索仓库 / 描述 / topic"
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground md:ml-auto">
          {filtered.length} / {repos.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {HUB_CATEGORIES.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={c === category ? "default" : "outline"}
            className="h-8"
            onClick={() => setCategory(c)}
          >
            {HUB_CATEGORY_LABELS[c]}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          这个筛选下还没有仓库。试试切换分类。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <RepoCard key={r.fullName} repo={r} />
          ))}
        </div>
      )}
    </div>
  );
}
