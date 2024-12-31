import { defineConfig as defineViteConfig } from "vite";
import { defineConfig as defineVitestConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
const viteConfig = defineViteConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
    },
  },
});

// Vitest configuration
const vitestConfig = defineVitestConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/testSetup.ts",
  },
});

export default mergeConfig(viteConfig, vitestConfig);
