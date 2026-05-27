"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container-page py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <Image
              src="/logo-on-light.png"
              alt="Overmap"
              width={24}
              height={24}
              className="size-6 dark:hidden"
            />
            <Image
              src="/logo-on-dark.png"
              alt="Overmap"
              width={24}
              height={24}
              className="size-6 hidden dark:block"
            />
            {siteConfig.name}
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            {t("footer.tagline")}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">{t("footer.siteLinks")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-foreground">
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/changelog" className="hover:text-foreground">
                {t("footer.changelog")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-foreground">
                {t("footer.about")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">{t("footer.relatedLinks")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={siteConfig.mainSite}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                {t("footer.mainSite")}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.docs}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                {t("footer.docs")}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                {t("footer.github")}
              </a>
            </li>
            <li>
              <a href="/feed.xml" className="hover:text-foreground">
                {t("footer.rss")}
              </a>
            </li>
            <li>
              <a href="/sitemap.xml" className="hover:text-foreground">
                {t("footer.sitemap")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </div>
          <div className="opacity-70">{t("footer.builtWith")}</div>
        </div>
      </div>
    </footer>
  );
}
