import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// The site is published to https://motoshira.github.io/pebbles/, so every
// environment (dev, preview, production) serves from "/pebbles/". Keeping the
// base identical everywhere means `vite preview` faithfully reproduces the
// deployed GitHub Pages build.
export default defineConfig({
  base: "/pebbles/",
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
