import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/site/copy-button";
import type { PromptItem } from "@/lib/prompts-meta";

export function PromptCard({ prompt }: { prompt: PromptItem }) {
  return (
    <Card className="h-full glass-2 group">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/prompts/${prompt.slug}`}
              className="font-semibold tracking-tight group-hover:text-primary"
            >
              {prompt.title}
            </Link>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{prompt.category}</span>
              {prompt.model && (
                <>
                  <span className="opacity-50">·</span>
                  <span>{prompt.model}</span>
                </>
              )}
            </div>
          </div>
          <CopyButton text={prompt.prompt} label="复制" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {prompt.description}
        </p>
        <pre className="rounded-md border border-border bg-muted/40 p-3 text-xs text-foreground/80 line-clamp-4 whitespace-pre-wrap break-words">
          {prompt.prompt}
        </pre>
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.slice(0, 4).map((t) => (
              <Badge key={t} variant="outline" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
