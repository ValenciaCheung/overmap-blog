/**
 * Minimal `<script type="application/ld+json">` emitter so any page can
 * add Schema.org structured data without escaping headaches.
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", ... }} />
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data)
    ? data.map((d) => ({ "@context": "https://schema.org", ...d }))
    : { "@context": "https://schema.org", ...data };
  return (
    <script
      type="application/ld+json"
      // String → bytes; dangerouslySetInnerHTML is required for raw JSON inside <script>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

import { siteConfig } from "@/lib/site";

/** Schema.org Organization fragment used in many entity references */
export const orgSchema = {
  "@type": "Organization",
  name: "Overmap",
  url: siteConfig.mainSite,
  logo: `${siteConfig.url}/icon.png`,
  sameAs: [siteConfig.github, siteConfig.twitter].filter(Boolean),
} as const;

/** Schema.org WebSite with SearchAction (drives Google Sitelinks search box) */
export const websiteSchema = {
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: ["zh-CN", "en"],
  publisher: orgSchema,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/?q={search_term}`,
    "query-input": "required name=search_term",
  },
} as const;

/** Helper to build a BreadcrumbList */
export function breadcrumb(
  items: Array<{ name: string; href: string }>,
): object {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.href.startsWith("http")
        ? it.href
        : `${siteConfig.url}${it.href}`,
    })),
  };
}
