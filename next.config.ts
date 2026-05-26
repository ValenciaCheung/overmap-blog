import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static export — emits a fully static site to `out/` on build,
   * letting us drop it onto any static host (Cloudflare Pages, GitHub Pages, S3, etc.)
   * without a Node runtime or framework adapter.
   *
   * All app routes are either `○ Static` or `● SSG (generateStaticParams)`,
   * which is exactly what static export supports.
   */
  output: "export",

  /**
   * Static export disables the next/image optimizer, so we must opt into
   * unoptimized image loading. Repo avatars and our own logos are already
   * sized appropriately.
   */
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
    ],
  },

  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
