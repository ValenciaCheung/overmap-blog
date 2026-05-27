import Link from "next/link";
import { ArrowUpRight, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SkillItem } from "@/lib/skills-meta";

export function SkillCard({ skill }: { skill: SkillItem }) {
  return (
    <Link href={`/hub/skills/${skill.slug}`} className="group">
      <Card className="h-full glass-2 transition-colors hover:border-primary/40">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent shrink-0">
              <Wand2 className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-mono text-sm font-semibold tracking-tight group-hover:text-primary truncate">
                  {skill.name}
                </h3>
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                anthropics/skills
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
            {skill.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
