import Image from "next/image";
import { Star, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HUB_CATEGORY_LABELS, type HubRepo } from "@/lib/hub-meta";

function formatStars(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function RepoCard({ repo }: { repo: HubRepo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="group block"
    >
      <Card className="h-full glass-2 transition-colors hover:border-primary/40">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Image
              src={repo.ownerAvatar}
              alt={repo.owner}
              width={40}
              height={40}
              className="size-10 rounded-lg border border-border bg-card"
              unoptimized
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold tracking-tight group-hover:text-primary truncate">
                  {repo.fullName}
                </h3>
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="size-3" />
                  {formatStars(repo.stars)}
                </span>
                {repo.language && (
                  <>
                    <span className="opacity-50">·</span>
                    <span>{repo.language}</span>
                  </>
                )}
                <span className="opacity-50">·</span>
                <span>{HUB_CATEGORY_LABELS[repo.category] ?? repo.category}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {repo.note ?? repo.description}
          </p>
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {repo.topics.slice(0, 4).map((t) => (
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
