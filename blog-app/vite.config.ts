import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { blogDevPlugin } from "./vite-plugin-blog-dev";

const repoRoot = path.resolve(import.meta.dirname, "..");

export default defineConfig({
  plugins: [react(), tailwindcss(), blogDevPlugin()],
  base: "/blog/",
  publicDir: path.join(repoRoot, "public"),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  server: {
    port: 5174,
    fs: { allow: [repoRoot] },
  },
  build: {
    outDir: path.join(repoRoot, "blog"),
    emptyOutDir: true,
  },
});
