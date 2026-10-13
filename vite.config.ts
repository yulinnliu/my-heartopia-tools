// defineConfig comes from vitest/config, not vite, so the `test` block below
// type-checks under `tsc -b`. vitest is a devDependency; `npm run build` needs
// dev deps installed (`npm run build` needs a full `npm ci`).
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// The site is served from the root of its own domain.
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
