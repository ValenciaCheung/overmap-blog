# 部署：blog.overmap.org

## 1. 推到 GitHub

```bash
# 项目根目录
git add -A
git commit -m "init: overmap blog scaffold"
git remote add origin git@github.com:overmapai/overmap-blog.git
git push -u origin main
```

> 如果还没有 GitHub 组织 `overmapai`，可以先用个人账号 push，之后改 remote。

## 2. Vercel 接入（推荐）

1. 打开 [vercel.com/new](https://vercel.com/new)，选择刚推的 `overmap-blog` 仓库
2. Vercel 自动识别 **Next.js** ✅
3. **Framework**: `Next.js`（自动）
4. **Build Command**: `pnpm build`（自动）
5. **Install Command**: `pnpm install`
6. **Environment Variables** (可选):
   - `GITHUB_TOKEN` —— 给 `scripts/sync-github.ts` 用，避免 60 次 / 小时的匿名 rate limit。
     用任意 PAT 即可，建议只勾 `public_repo` 读权限。
7. 点 Deploy。首次构建 ~1-2 分钟。

## 3. DNS：绑定 blog.overmap.org

在 `overmap.org` 主域所属的 DNS 服务商（Cloudflare / 阿里云 / Namecheap 等）加一条记录：

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `blog` | `cname.vercel-dns.com` | Auto / 600 |

> 用 Cloudflare 的话，注意 **Proxy 状态设为 DNS only**（灰色云）。Vercel 已经做了 CDN，Cloudflare 再代理一层会导致重定向死循环或 SSL 报错。

回到 Vercel 项目 → Settings → Domains，添加 `blog.overmap.org`。Vercel 会自动签发 SSL（Let's Encrypt），通常 1-2 分钟生效。

验证：

```bash
curl -I https://blog.overmap.org
# 期望：HTTP/2 200，server: Vercel
```

## 4. 同步策略

### GitHub 数据

`data/hub-cache.json` 是 build 期生成的（`prebuild` hook 跑 `sync:github`）。每次 deploy 自动刷新。

如果想 **定时刷新**（比如每天凌晨抓最新 star 数），在 Vercel 项目 → Settings → Cron Jobs 加一条：

```
0 18 * * *  GET https://blog.overmap.org/api/revalidate?secret=xxx
```

然后写一个 `app/api/revalidate/route.ts` 用 `revalidatePath('/hub')`。

> 简化版：先不开 cron，每次 push 内容自动 redeploy 就够了。

### 内容更新

所有内容（MDX / JSON / seeds）都在 git 里。流程：

1. 本地写 / 编辑 → `pnpm dev` 预览
2. `git add` → `git commit` → `git push`
3. Vercel 自动 build & deploy

## 5. 备选：Cloudflare Pages

如果不想用 Vercel：

1. Cloudflare Dashboard → Pages → Create a project
2. 连接 GitHub 仓库
3. **Build command**: `pnpm build`
4. **Build output directory**: `.next` （或用 `@cloudflare/next-on-pages` 适配器）
5. **Environment variable**: `NODE_VERSION=20`, 可选 `GITHUB_TOKEN`
6. 加 Custom domain `blog.overmap.org`

> Next 16 + App Router 在 Cloudflare Pages 上需要 `@cloudflare/next-on-pages` 适配层，配置比 Vercel 复杂。建议先用 Vercel。

## 6. 备选：自托管 VPS

如果想跟主站一起放在 Vultr Osaka：

```bash
# 在 VPS 上
git clone https://github.com/overmapai/overmap-blog.git
cd overmap-blog
pnpm install
pnpm build
pm2 start "pnpm start" --name overmap-blog
```

然后用 Caddy / Nginx 反代 `blog.overmap.org` 到 `localhost:3000`。

## 7. SEO checklist

- [ ] `siteConfig.url` 改成正式域名（`src/lib/site.ts`）
- [ ] `public/` 放 `favicon.ico`、`og-image.png`（1200x630）
- [ ] `app/sitemap.ts` 自动生成（建议加上）
- [ ] `app/robots.ts` 允许爬虫
- [ ] Google Search Console 提交 sitemap.xml
- [ ] 百度站长（如果有中国大陆访问需求）

## 8. 故障排查

| 症状 | 可能原因 | 处理 |
|------|---------|------|
| build 时 `sync:github` 报 403 | 匿名 rate limit | 加 `GITHUB_TOKEN` 环境变量 |
| 部分 MDX 渲染异常 | frontmatter 缺字段 | 看 build log 里的 console.warn |
| 暗黑模式切换闪烁 | next-themes 未挂载 | 已在 layout.tsx 加 `suppressHydrationWarning` |
| 自定义域 SSL 报错 | Cloudflare proxy 开启 | 关闭 proxy（DNS only） |
