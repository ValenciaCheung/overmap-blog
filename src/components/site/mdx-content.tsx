import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as RehypePrettyOptions } from "rehype-pretty-code";

const prettyCodeOptions: RehypePrettyOptions = {
  theme: { dark: "github-dark", light: "github-light" },
  keepBackground: false,
};

export function MdxContent({ source }: { source: string }) {
  return (
    <article className="prose-overmap max-w-none">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              [rehypePrettyCode, prettyCodeOptions],
            ],
          },
        }}
      />
    </article>
  );
}
