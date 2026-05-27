"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";
import { CopyButton } from "@/components/site/copy-button";
import { cn } from "@/lib/utils";

type Mode = "degit" | "curl" | "clone";

export function SkillInstall({ slug }: { slug: string }) {
  const [mode, setMode] = useState<Mode>("degit");

  const commands: Record<Mode, { label: string; hint: string; cmd: string }> = {
    degit: {
      label: "degit (推荐)",
      hint: "用 npx degit 把整个 skill 目录（含 references/、scripts/）拉到 ~/.claude/skills/",
      cmd: `npx degit anthropics/skills/skills/${slug} ~/.claude/skills/${slug}`,
    },
    curl: {
      label: "curl (只要 SKILL.md)",
      hint: "如果你只需要 SKILL.md 本身,不需要附属资源",
      cmd: `mkdir -p ~/.claude/skills/${slug} && curl -fsSL https://raw.githubusercontent.com/anthropics/skills/main/skills/${slug}/SKILL.md -o ~/.claude/skills/${slug}/SKILL.md`,
    },
    clone: {
      label: "git sparse-checkout",
      hint: "如果你以后会装多个 anthropics/skills 里的 skill,clone 整仓再 sparse-checkout 最稳",
      cmd: [
        `git clone --filter=blob:none --no-checkout https://github.com/anthropics/skills.git /tmp/anthropic-skills`,
        `cd /tmp/anthropic-skills && git sparse-checkout init --cone && git sparse-checkout set skills/${slug} && git checkout main`,
        `mkdir -p ~/.claude/skills && cp -r /tmp/anthropic-skills/skills/${slug} ~/.claude/skills/${slug}`,
      ].join(" && \\\n  "),
    },
  };

  const active = commands[mode];

  return (
    <section className="not-prose mb-10 rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40">
        <Terminal className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">如何在 Claude Code 用</h2>
      </div>

      <div className="px-5 pt-4 pb-5 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(commands) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md border px-3 py-1 text-xs transition-colors",
                m === mode
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:bg-accent text-muted-foreground",
              )}
            >
              {commands[m].label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">{active.hint}</p>

        <div className="relative rounded-md border border-border bg-muted/40">
          <pre className="px-3 py-3 pr-20 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {active.cmd}
          </pre>
          <div className="absolute top-2 right-2">
            <CopyButton text={active.cmd} label="复制" size="sm" />
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          安装完后,新开一个 Claude Code session 即可识别。当你的提问符合
          <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono">description</code>
          描述的触发条件时,Claude 会自动加载这个 skill。
        </p>
      </div>
    </section>
  );
}
