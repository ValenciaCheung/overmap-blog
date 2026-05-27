"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchEntry {
  id: string;
  type: "tool" | "skill" | "prompt" | "blog" | "page";
  title: string;
  description: string;
  href: string;
  hint?: string;
  keywords?: string[];
}

const TYPE_LABEL: Record<SearchEntry["type"], string> = {
  page: "页面",
  tool: "工具",
  skill: "Skill",
  prompt: "提示词",
  blog: "博客",
};

const TYPE_ORDER: SearchEntry["type"][] = [
  "page",
  "tool",
  "skill",
  "prompt",
  "blog",
];

export function GlobalSearchButton() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const loadedRef = useRef(false);

  // cmd+K / ctrl+K global shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && document.activeElement === document.body) {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lazy-load the index the first time the dialog opens
  useEffect(() => {
    if (!open || loadedRef.current) return;
    loadedRef.current = true;
    setLoading(true);
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: SearchEntry[]) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [open]);

  // Group entries by type, preserve in-type ordering from the index
  const grouped = useMemo(() => {
    if (!entries) return null;
    const map: Record<SearchEntry["type"], SearchEntry[]> = {
      page: [],
      tool: [],
      skill: [],
      prompt: [],
      blog: [],
    };
    for (const e of entries) map[e.type].push(e);
    return map;
  }, [entries]);

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="size-3.5" />
        <span className="hidden md:inline">搜索</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
          ⌘K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
          <DialogTitle className="sr-only">全站搜索</DialogTitle>
          <DialogDescription className="sr-only">
            跨工具、Skills、提示词、博客的全局搜索
          </DialogDescription>
          <Command
            label="全站搜索"
            className="flex flex-col"
            filter={(value, search, keywords) => {
              const s = search.toLowerCase();
              if (value.toLowerCase().includes(s)) return 1;
              if (keywords && keywords.some((k) => k.toLowerCase().includes(s))) return 0.7;
              return 0;
            }}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="size-4 text-muted-foreground" />
              <Command.Input
                placeholder="搜索工具 / Skill / 提示词 / 博客..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              <kbd className="hidden md:inline-flex rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                ESC
              </kbd>
            </div>
            <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
              {loading && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  加载索引中…
                </div>
              )}
              {!loading && grouped && (
                <>
                  <Command.Empty className="p-6 text-center text-sm text-muted-foreground">
                    没找到匹配的内容
                  </Command.Empty>
                  {TYPE_ORDER.map((type) => {
                    const items = grouped[type];
                    if (!items.length) return null;
                    return (
                      <Command.Group
                        key={type}
                        heading={TYPE_LABEL[type]}
                        className={cn(
                          "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
                        )}
                      >
                        {items.map((it) => (
                          <Command.Item
                            key={it.id}
                            value={`${it.title} ${it.description}`}
                            keywords={it.keywords}
                            onSelect={() => handleSelect(it.href)}
                            className={cn(
                              "flex items-start gap-3 rounded-md px-3 py-2 cursor-pointer transition-colors",
                              "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                            )}
                          >
                            <span className="text-lg leading-none mt-0.5">
                              {it.hint ?? "·"}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {it.title}
                              </div>
                              {it.description && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {it.description}
                                </div>
                              )}
                            </div>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    );
                  })}
                </>
              )}
            </Command.List>
            <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
              <span>
                {entries
                  ? `${entries.length} 条索引`
                  : "加载后可搜索全站内容"}
              </span>
              <span className="flex items-center gap-2">
                <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">↑↓</kbd>
                导航
                <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">⏎</kbd>
                打开
              </span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
