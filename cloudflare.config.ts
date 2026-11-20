import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "aaron212-portfolio",
    compatibilityDate: "2026-08-29",
    workersDev: false,
    previewUrls: true,
    assets: {
      notFoundHandling: "404-page",
      htmlHandling: "auto-trailing-slash",
    },
  },
});
