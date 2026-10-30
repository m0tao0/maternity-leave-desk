import react from "@vitejs/plugin-react";
import { cpSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base =
  process.env.GITHUB_ACTIONS === "true" && repositoryName
    ? `/${repositoryName}/`
    : "/";

export default defineConfig({
  root: fileURLToPath(new URL("./github-pages", import.meta.url)),
  base,
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  plugins: [
    react(),
    {
      name: "copy-gandengyan",
      closeBundle() {
        cpSync(
          fileURLToPath(new URL("./gandengyan", import.meta.url)),
          `${projectRoot}dist-pages/gandengyan`,
          { recursive: true },
        );
      },
    },
  ],
  build: {
    outDir: `${projectRoot}dist-pages`,
    emptyOutDir: true,
  },
});
