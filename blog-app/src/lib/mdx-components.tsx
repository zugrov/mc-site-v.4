import type { MDXComponents } from "mdx/types";
import { CTA } from "@/components/blog/CTA";
import { Callout } from "@/components/blog/Callout";

export const mdxComponents: MDXComponents = {
  Callout,
  CTA,
  table: (props) => (
    <div className="blog-table-wrap">
      <table className="blog-table" {...props} />
    </div>
  ),
  thead: (props) => <thead {...props} />,
  tbody: (props) => <tbody {...props} />,
  tr: (props) => <tr {...props} />,
  th: (props) => <th scope="col" {...props} />,
  td: (props) => <td {...props} />,
  img: ({ alt, ...props }) => (
    <img
      alt={alt ?? ""}
      loading="lazy"
      className="rounded-lg my-6 w-full"
      {...props}
    />
  ),
};
