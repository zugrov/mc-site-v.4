import type { MDXComponents } from "mdx/types";
import { CTA } from "@/components/blog/CTA";
import { Callout } from "@/components/blog/Callout";

export const mdxComponents: MDXComponents = {
  Callout,
  CTA,
  table: (props) => (
    <div className="blog-table-wrap overflow-x-auto my-6">
      <table className="blog-table w-full text-sm" {...props} />
    </div>
  ),
  img: ({ alt, ...props }) => (
    <img
      alt={alt ?? ""}
      loading="lazy"
      className="rounded-lg my-6 w-full"
      {...props}
    />
  ),
};
