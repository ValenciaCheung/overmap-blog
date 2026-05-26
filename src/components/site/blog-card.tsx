import Link from "next/link";
import { format } from "date-fns";
import { Clock, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog-meta";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="h-full glass-2 transition-colors hover:border-primary/40">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={post.date}>
              {format(new Date(post.date), "yyyy-MM-dd")}
            </time>
            <span className="opacity-50">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              {post.readingMinutes} 分钟
            </span>
            {post.video && (
              <>
                <span className="opacity-50">·</span>
                <span className="inline-flex items-center gap-1 text-primary">
                  <PlayCircle className="size-3" />
                  视频
                </span>
              </>
            )}
          </div>
          <h3 className="mt-2 text-lg font-semibold tracking-tight group-hover:text-primary line-clamp-2">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {post.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {post.description}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 4).map((t) => (
                <Badge key={t} variant="secondary" className="font-normal">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
