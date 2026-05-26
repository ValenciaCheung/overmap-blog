# 部署：blog.overmap.org

整站是**纯静态导出**（`next.config.ts` 配了 `output: "export"`），所以可以丢到任何静态托管，零运行时。Cloudflare Pages 是首选。

---

## 路线 A：Cloudflare Pages — Dashboard 自动接入（推荐，~5 分钟）

### 1. 接入 GitHub 仓库

1. 打开 [https://dash.cloudflare.com/](https://dash.cloudflare.com/) → 左侧 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 授权 Cloudflare 访问 GitHub，选择 `ValenciaCheung/overmap-blog`
3. 填以下参数：

   | 字段 | 值 |
   |------|------|
   | Project name | `overmap-blog` |
   | Production branch | `main` |
   | Framework preset | **Next.js (Static HTML Export)** |
   | Build command | `pnpm install --config.minimumReleaseAge=0 && pnpm build` |
   | Build output directory | `out` |
   | Root directory | (留空) |

4. **Environment variables**（可选但推荐）：
   - `NODE_VERSION` = `22`
   - `GITHUB_TOKEN` = 你的 PAT（避免 GitHub API 60次/小时的匿名 rate limit；只需 `public_repo` 读权限即可）

5. 点 **Save and Deploy**。第一次 build ~2 分钟。

### 2. 绑定自定义域 blog.overmap.org

部署成功后：

1. Cloudflare Dashboard → 你的 Pages 项目 → **Custom domains** → **Set up a custom domain**
2. 输入 `blog.overmap.org`，按提示一步接入。

   - 如果 `overmap.org` 主域已经在 Cloudflare 托管 → 一键完成，DNS 记录自动建好
   - 如果不在 Cloudflare → 到主域 DNS 服务商加一条：

     | Type | Name | Value |
     |------|------|-------|
     | `CNAME` | `blog` | `<你的项目>.pages.dev` |

3. SSL 证书 Cloudflare 自动签发（1-2 分钟）

验证：

```bash
curl -I https://blog.overmap.org
# 期望：HTTP/2 200，server: cloudflare
```

---

## 路线 B：Cloudflare Pages — 本地 CLI（适合 CI / 快速 dry-run）

如果不想接 GitHub（或者 CI 跑 build 慢，想本地 build 再推）：

```bash
# 一次性
pnpm dlx wrangler login                  # 浏览器授权

# 每次发布
pnpm build                               # 生成 out/
pnpm deploy:cf                           # = wrangler pages deploy out --project-name overmap-blog
```

预览部署（不会替换 production）：

```bash
pnpm deploy:cf:preview
# 输出一个临时 *.pages.dev 链接
```

`wrangler.toml` 已经配好 `pages_build_output_dir = "out"`，wrangler 知道部署哪个目录。

---

## 内容更新流程

```
1. 本地写 / 编辑 MDX / JSON
2. pnpm dev    → http://localhost:3000 预览
3. git push    → Cloudflare 自动 build & 上线
```

GitHub 数据（`/hub`）每次 build 时通过 `scripts/sync-github.ts` 重新抓取（`prebuild` hook 触发）。如果想 **定时刷新**（每天抓最新 star 数），在 Cloudflare Pages 项目 → **Deployments** → **Triggers** 加一条 cron `0 18 * * *`。

---

## 备选：纯 GitHub Pages

如果不用 Cloudflare：

1. 仓库 → **Settings** → **Pages** → Source 选 **GitHub Actions**
2. 加 `.github/workflows/pages.yml`：

   ```yaml
   name: Deploy to Pages
   on:
     push:
       branches: [main]
   jobs:
     build:
       runs-on: ubuntu-latest
       permissions: { pages: write, id-token: write }
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v4
           with: { version: 11 }
         - uses: actions/setup-node@v4
           with: { node-version: 22, cache: pnpm }
         - run: pnpm install --config.minimumReleaseAge=0
         - run: pnpm build
         - uses: actions/upload-pages-artifact@v3
           with: { path: out }
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

3. GitHub Pages 上线后路径是 `https://valenciacheung.github.io/overmap-blog/` —— 需要在 `next.config.ts` 加 `basePath: "/overmap-blog"`，否则资源 404。Cloudflare Pages 不需要这一步。

---

## 备选：自托管 VPS（跟主站同居）

放 Vultr Osaka VPS 上：

```bash
# VPS 端
git clone https://github.com/ValenciaCheung/overmap-blog.git
cd overmap-blog
pnpm install --config.minimumReleaseAge=0
pnpm build
# 把 out/ 整个挂到 nginx
sudo cp -r out/* /var/www/blog.overmap.org/
```

nginx 配置：

```nginx
server {
  listen 443 ssl http2;
  server_name blog.overmap.org;

  root /var/www/blog.overmap.org;
  index index.html;

  # static export 的 SPA 风格路由 fallback
  location / { try_files $uri $uri.html $uri/index.html =404; }

  # Next.js 资源带哈希，可以长缓存
  location /_next/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

## SEO checklist（上线前）

- [ ] `src/lib/site.ts` 把 `siteConfig.url` 改成正式域名
- [ ] 写 `app/sitemap.ts`（自动从 blog/tools/prompts 数据生成）
- [ ] 写 `app/robots.ts`
- [ ] `public/` 放 `og-image.png`（1200×630，跟主站统一品牌）
- [ ] Google Search Console / 百度站长 提交 sitemap.xml
- [ ] Plausible / Umami 等无 cookie 统计接入

---

## 故障排查

| 症状 | 原因 | 处理 |
|------|------|------|
| Cloudflare build 报 `pnpm: command not found` | 没指定 packageManager | package.json 加 `"packageManager": "pnpm@11.3.0"` |
| `prebuild` 在 Cloudflare 上失败 | 抓 GitHub API 触发 rate limit | 项目设置加 env var `GITHUB_TOKEN` |
| 部分图片 404 | 静态导出禁用了 Image Optimizer | 已设 `images.unoptimized: true`，应该 OK；如果还有问题检查图片路径大小写 |
| 自定义域 SSL 报错 | Cloudflare Proxy 状态错误 | 主域不在 Cloudflare 时，灰色云（DNS only）；在 Cloudflare 时，橙色云（Proxied）|
| 暗黑模式切换闪烁 | next-themes 未挂载完 | 已加 `suppressHydrationWarning`，正常情况下不会闪 |
