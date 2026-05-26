import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container-page py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-block size-2 rounded-full bg-primary" aria-hidden />
            {siteConfig.name}
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">站内</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">关联</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={siteConfig.mainSite}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                Overmap 主站
              </a>
            </li>
            <li>
              <a
                href={siteConfig.docs}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                文档站
              </a>
            </li>
            <li>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Overmap. 内容用于学习与研究分享。</div>
          <div className="opacity-70">Built with Next.js · shadcn/ui · MDX</div>
        </div>
      </div>
    </footer>
  );
}
