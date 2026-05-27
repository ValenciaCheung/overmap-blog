"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/site/tool-card";
import {
  CATEGORY_LABELS,
  TOOL_CATEGORIES,
  PRICING_LABEL,
  type ToolCategory,
  type ToolItem,
} from "@/lib/tools-meta";
import { cn } from "@/lib/utils";

type SortMode = "popularity" | "alpha" | "newest";
type PricingFilter = "all" | "free" | "freemium" | "paid";

const PAGE_SIZE = 36;

const SORT_LABEL: Record<SortMode, string> = {
  popularity: "热门",
  alpha: "字母",
  newest: "最新加入",
};

const PRICING_FILTER_LABEL: Record<PricingFilter, string> = {
  all: "全部定价",
  free: PRICING_LABEL.free,
  freemium: PRICING_LABEL.freemium,
  paid: PRICING_LABEL.paid,
};

function compareTools(a: ToolItem, b: ToolItem, mode: SortMode): number {
  switch (mode) {
    case "alpha":
      return a.name.localeCompare(b.name);
    case "newest":
      // featured first, then trending, then new badge
      return (
        (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0) ||
        (b.badge === "trending" ? 1 : 0) - (a.badge === "trending" ? 1 : 0) ||
        (b.popularity ?? 0) - (a.popularity ?? 0)
      );
    case "popularity":
    default:
      return (
        (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
        (b.popularity ?? 0) - (a.popularity ?? 0) ||
        a.name.localeCompare(b.name)
      );
  }
}

export function ToolsExplorer({ tools }: { tools: ToolItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ToolCategory>("all");
  const [pricing, setPricing] = useState<PricingFilter>("all");
  const [sort, setSort] = useState<SortMode>("popularity");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = tools.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (pricing !== "all" && t.pricing !== pricing) return false;
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
    return list.sort((a, b) => compareTools(a, b, sort));
  }, [tools, query, category, pricing, sort]);

  // Reset visible window whenever filters change
  const visibleCount = Math.min(visible, filtered.length);
  const items = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  // when any filter changes, reset paging
  // (use a small effect-free trick: piggyback on sort/cat/pricing/query memo)
  // simpler: reset on each change via handler
  const resetVisible = () => setVisible(PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Top bar: search + counts + sort */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetVisible();
            }}
            placeholder="搜索工具名、关键词、标签"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* pricing filter */}
          <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
            {(["all", "free", "freemium", "paid"] as PricingFilter[]).map(
              (p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPricing(p);
                    resetVisible();
                  }}
                  className={cn(
                    "rounded px-2 py-1 text-xs transition-colors",
                    p === pricing
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {PRICING_FILTER_LABEL[p]}
                </button>
              ),
            )}
          </div>

          {/* sort */}
          <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
            {(["popularity", "newest", "alpha"] as SortMode[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={cn(
                  "rounded px-2 py-1 text-xs transition-colors",
                  s === sort
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {SORT_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground md:ml-auto">
          {filtered.length} / {tools.length}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        {TOOL_CATEGORIES.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={c === category ? "default" : "outline"}
            className="h-8"
            onClick={() => {
              setCategory(c);
              resetVisible();
            }}
          >
            {CATEGORY_LABELS[c]}
          </Button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          没找到匹配的工具。换个关键词试试。
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>

          {remaining > 0 && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="gap-1"
              >
                再加载 {Math.min(PAGE_SIZE, remaining)} 个
                <ChevronDown className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
