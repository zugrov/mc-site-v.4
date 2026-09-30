import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin, ViteDevServer } from "vite";

const pluginDir = path.dirname(fileURLToPath(import.meta.url));

function summariesModuleId(server: ViteDevServer) {
  return path.join(pluginDir, "scripts/blog-summaries.ts");
}

function devApiModuleId(server: ViteDevServer) {
  return path.join(pluginDir, "scripts/blog-dev-api.ts");
}

export function blogDevPlugin(): Plugin {
  return {
    name: "blog-dev-data",
    apply: "serve",
    configureServer(server) {
      void server.ssrLoadModule(summariesModuleId(server)).then((mod) => {
        const { CONTENT_DIR } = mod as { CONTENT_DIR: string };
        server.watcher.add(CONTENT_DIR);
        const reloadBlog = (file: string) => {
          if (file.includes("content/blog/") || file.includes("content\\blog\\")) {
            server.ws.send({ type: "full-reload", path: "*" });
          }
        };
        server.watcher.on("add", reloadBlog);
        server.watcher.on("change", reloadBlog);
        server.watcher.on("unlink", reloadBlog);
      });

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        if (!url.startsWith("/blog/__dev/post/")) {
          next();
          return;
        }
        try {
          const api = await server.ssrLoadModule(devApiModuleId(server));
          const handled = await (
            api as {
              handleBlogDevPostJson: (
                req: typeof req,
                res: typeof res,
                url: string,
              ) => Promise<boolean>;
            }
          ).handleBlogDevPostJson(req, res, url);
          if (!handled) next();
        } catch (err) {
          next(err);
        }
      });
    },
    transformIndexHtml: {
      order: "post",
      async handler(html, ctx) {
        if (!ctx.server) return html;
        const mod = await ctx.server.ssrLoadModule(summariesModuleId(ctx.server));
        const { loadPostSummaries, serializeForInlineScript, slugFromBlogRequestUrl } =
          mod as {
            loadPostSummaries: () => unknown[];
            serializeForInlineScript: (data: unknown) => string;
            slugFromBlogRequestUrl: (url?: string) => string | null;
          };

        const posts = loadPostSummaries();
        let inline = `window.__BLOG_POSTS__=${serializeForInlineScript(posts)};`;

        const slug = slugFromBlogRequestUrl(ctx.originalUrl);
        if (slug) {
          inline += `window.__BLOG_DEV_SLUG__=${serializeForInlineScript(slug)};`;
        }

        const script = `<script>${inline}</script>`;
        if (html.includes("</body>")) {
          return html.replace("</body>", `${script}</body>`);
        }
        return `${html}${script}`;
      },
    },
  };
}
