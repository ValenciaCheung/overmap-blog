# Overmap Blog

> AI 知识 · 工具 · 提示词的集中分发地。
> Overmap 主站的二级域名内容生态。

**Live:** [blog.overmap.org](https://blog.overmap.org) · **Main:** [overmap.org](https://overmap.org) · **Repo:** [github.com/ValenciaCheung/overmap-blog](https://github.com/ValenciaCheung/overmap-blog)

---

## Stats(自动更新)

| 项 | 数量 |
|---|---|
| 🛠 AI 工具 | **220** 个 · 15 个分类 |
| ✨ Anthropic Skills | **17** 个(从 anthropics/skills 自动同步) |
| 🐙 GitHub 精选 | **9** 个开源项目 |
| 📝 博客文章 | **11** 篇 |
| 💬 Prompts 模板 | **23** 个 |
| 📋 总静态页 | **80+** |

---

## 模块

| 路由 | 说明 |
|------|------|
| `/` | 首页 Feed:Hero stats + Trending + 博客 + 工具 + Prompts + Skills Hub |
| `/tools` | AI 工具库,15 个分类卡片 + 全量探索 |
| `/tools/[category]` | 15 个分类 SEO 落地页(chat/image/video/...) |
| `/blog` | 博客列表(搜索 + tag 筛选 + RSS) |
| `/blog/[slug]` | 博客详情(MDX + Shiki 高亮) |
| `/hub` | Skills Hub — GitHub 开源精选 + Anthropic Skills 入口 |
| `/hub/skills` | Anthropic Skills 索引(17 个) |
| `/hub/skills/[slug]` | Skill 详情 + 一键安装命令(degit / curl / sparse-checkout) |
| `/prompts` | 提示词库(搜索 + 分类筛选) |
| `/prompts/[slug]` | 提示词详情(一键复制) |
| `/changelog` | git log 自动生成的更新时间线 |
| `/about` | 关于本站 |
| `/feed.xml` | RSS 2.0 订阅 |
| `/sitemap.xml` | 完整 sitemap(80+ URLs) |
| `/search-index.json` | cmd+K 全站搜索索引(288 条) |

## 技术栈

- **Next.js 16 (App Router)** + React 19 + TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (`radix-nova` 风格)
- **MDX** via `next-mdx-remote/rsc` + `gray-matter`
- **Shiki + rehype-pretty-code** 代码高亮（亮 / 暗双主题）
- **next-themes** 系统主题跟随
- **构建时 GitHub API 抓取** → `data/hub-cache.json`

设计 token 直接 fork 自主站 `overmap-relay/web/default/src/styles/theme.css`（new-api / `radix-nova`），换肤同步只要复制覆盖即可。

## 本地开发

需要 Node 20+ 与 pnpm 8+。

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # 静态生成（含 GitHub 同步）
pnpm start
```

## 添加内容

### 写一篇博客

新建 `content/blog/<slug>.mdx`：

```mdx
---
title: "文章标题"
description: "一句话简介，在卡片和 SEO 里用"
date: "2026-05-26"
tags: ["Next.js", "AI"]
author: "Overmap Team"
video: "https://www.youtube.com/watch?v=xxx"   # 可选 —— 标记为视频配套文字稿
---

正文...
```

支持 GFM、自动标题锚链接、Shiki 代码高亮（双主题）。

### 收录一个 AI 工具

编辑 `data/tools.json`，追加一个对象：

```json
{
  "id": "unique-slug",
  "name": "Tool Name",
  "url": "https://example.com",
  "description": "一句话说明它解决什么问题",
  "category": "chat",            // chat | image | video | audio | code | agent | design | writing | search
  "tags": ["LLM", "OpenAI"],
  "pricing": "freemium",         // free | freemium | paid
  "featured": true,              // 是否上首页
  "logo": "🤖"
}
```

### 收录一个 GitHub 项目

1. 编辑 `data/hub-seeds.json`，加一行：

   ```json
   { "fullName": "owner/repo", "category": "agents", "note": "编辑视角的中文短评" }
   ```

   `category` 可选：`skills | agents | framework | prompts | ui | devtools`

2. 跑同步：

   ```bash
   pnpm sync:github
   # 高速率限制需要 token：
   GITHUB_TOKEN=ghp_xxx pnpm sync:github
   ```

   结果会写到 `data/hub-cache.json` 并按 star 排序。该文件已提交到仓库，离线也能渲染。

### 写一条提示词

新建 `content/prompts/<slug>.mdx`：

```mdx
---
title: "提示词标题"
description: "一句话场景"
category: "内容写作"        # 自由分类
tags: ["改写", "中文"]
model: "Claude / GPT-4o"
prompt: |
  这里放完整的提示词正文。
  可以是多行。
---

正文：用法、改写思路、坑点等。
```

`prompt` 字段就是「一键复制」按钮拷贝的内容；正文是详情页的 MDX 说明。

## 目录结构

```
src/
  app/                  # Next.js App Router pages
  components/
    ui/                 # shadcn/ui 组件
    site/               # 站点级组件（header / footer / cards）
  lib/
    *-meta.ts           # 类型 + 常量（client-safe）
    *.ts                # server-only：读 fs / 解析 MDX
  styles/
    theme.css           # 设计 token（与主站对齐）
content/
  blog/                 # 博客 MDX
  prompts/              # 提示词 MDX
data/
  tools.json            # AI 工具
  hub-seeds.json        # 待同步的 GitHub 项目列表
  hub-cache.json        # 同步后的缓存数据
scripts/
  sync-github.ts        # 抓取 GitHub 元数据
```

## 部署

见 [DEPLOY.md](./DEPLOY.md)。简版：

1. 推到 GitHub
2. 连接 Vercel，自动检测 Next.js
3. DNS 把 `blog.overmap.org` CNAME 到 `cname.vercel-dns.com`
4. Vercel 项目里设置 `blog.overmap.org` 为自定义域名

## 内容贡献

- 工具 / GitHub 项目推荐：直接提 PR 改 `data/*.json`
- 投稿博客 / 提示词：MDX 文件 + PR
- 问题反馈：GitHub Issues

## License

MIT — 内容（博客 / 提示词文本）默认 CC BY 4.0。
