import highlights from "@aaron212/astro-highlights";
import pele from "@aaron212/astro-pele";
import typlet from "@aaron212/astro-typlet";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { baseLocale, locales } from "./i18n.config";

export default defineConfig({
  site: "https://aaron212.com",
  output: "static",
  outDir: "./build",
  publicDir: "./static",
  i18n: {
    defaultLocale: baseLocale,
    locales,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !new URL(page).pathname.endsWith("/404/"),
    }),
    icon(),
    highlights(),
    pele(),
    typlet(),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
