import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, PRICING_LABEL, type ToolItem } from "@/lib/tools-meta";

export function ToolCard({ tool }: { tool: ToolItem }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noreferrer"
      className="group block"
    >
      <Card className="h-full glass-2 transition-colors hover:border-primary/40">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-xl">
              {tool.logo ?? "🤖"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold tracking-tight group-hover:text-primary truncate">
                  {tool.name}
                </h3>
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{CATEGORY_LABELS[tool.category] ?? tool.category}</span>
                {tool.pricing && (
                  <>
                    <span className="opacity-50">·</span>
                    <span>{PRICING_LABEL[tool.pricing]}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tool.tags.slice(0, 3).map((t) => (
                <Badge key={t} variant="outline" className="font-normal">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  );
}
