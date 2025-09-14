import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  site: "https://konkarin.github.io",
  base: "resume",
  integrations: [mdx()],
  markdown: {
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          content: {
            type: "text",
            value: "#",
          },
          properties: {
            className: ["anchor-link"],
          },
        },
      ],
    ],
  },
});
