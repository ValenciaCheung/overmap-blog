import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as RehypePrettyOptions,
} from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const prettyCodeOptions: RehypePrettyOptions = {
  theme: { dark: "github-dark", light: "github-light" },
  keepBackground: false,
};

/**
 * Pure Markdown (CommonMark + GFM) renderer.
 *
 * Use this for content authored as plain Markdown (e.g. `SKILL.md` files
 * we pull from random GitHub repos). Unlike MdxContent it does NOT try to
 * parse `<` as JSX, so expressions like `1 < 2` or `<value>` won't blow up.
 */
export async function MarkdownContent({ source }: { source: string }) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeStringify)
    .process(source);

  return (
    <article
      className="prose-overmap max-w-none"
      dangerouslySetInnerHTML={{ __html: String(file) }}
    />
  );
}
