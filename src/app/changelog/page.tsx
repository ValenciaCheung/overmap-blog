import type { Metadata } from "next";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/site/page-header";
import { getAllChangelogEntries } from "@/lib/changelog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Overmap Blog 站点更新历史 — 从 git log 自动生成。",
};

const TYPE_COLORS: Record<string, string> = {
  feat: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  fix: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  deploy: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  refactor: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  docs: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20",
  init: "bg-primary/10 text-primary border-primary/20",
};

function parseSubject(subject: string): { type: string; scope?: string; title: string } {
  const match = subject.match(/^(\w+)(?:\(([\w-]+)\))?:\s*(.+)$/);
  if (!match) return { type: "misc", title: subject };
  return { type: match[1], scope: match[2], title: match[3] };
}

export default function ChangelogPage() {
  const entries = getAllChangelogEntries();
  return (
    <>
      <PageHeader
        eyebrow="Changelog"
        title="站点更新历史"
        description={`${entries.length} 次提交。从 git log 自动生成 — 每次 push 都会重建。`}
      />

      <section className="container-page pb-16">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            还没有 changelog 数据。运行{" "}
            <code className="font-mono">pnpm sync:changelog</code> 试试。
          </div>
        ) : (
          <ol className="relative space-y-6 border-l border-border ml-2 pl-6">
            {entries.map((e) => {
              const { type, scope, title } = parseSubject(e.subject);
              const color = TYPE_COLORS[type] ?? TYPE_COLORS.misc ?? "";
              return (
                <li key={e.hash} className="relative">
                  <span
                    className="absolute -left-[33px] top-1.5 size-3 rounded-full border-2 border-background bg-primary"
                    aria-hidden
                  />
                  <article className="glass-2 rounded-xl p-5">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                      <Badge
                        variant="outline"
                        className={`font-mono ${color}`}
                      >
                        {type}
                        {scope ? `(${scope})` : ""}
                      </Badge>
                      <time dateTime={e.date}>
                        {format(new Date(e.date), "yyyy-MM-dd HH:mm")}
                      </time>
                      <span className="opacity-50">·</span>
                      <a
                        href={`${siteConfig.github}/overmap-blog/commit/${e.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono hover:text-foreground"
                      >
                        {e.shortHash}
                        <ExternalLink className="size-3" />
                      </a>
                      <span className="opacity-50">·</span>
                      <span>{e.filesChanged} files</span>
                    </div>
                    <h3 className="font-semibold tracking-tight">{title}</h3>
                    {e.body && (
                      <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap break-words font-sans leading-relaxed">
                        {e.body
                          .split("\n")
                          .filter(
                            (line) => !line.startsWith("Co-Authored-By:"),
                          )
                          .join("\n")
                          .trim()}
                      </pre>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </>
  );
}
