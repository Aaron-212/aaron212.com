import { getRelativeLocaleUrl } from "astro:i18n";
import { baseLocale } from "../../i18n.config";

const breadcrumbTitles: Record<string, string> = {
  "c-and-cpp": "C and C++",
  cheatsheets: "Cheat sheets",
  css: "CSS",
  docs: "Docs",
  github: "GitHub",
  "java-and-kotlin": "Java and Kotlin",
  javascript: "JavaScript",
  "javascript-ecosystem": "JavaScript ecosystem",
  mcp: "MCP",
  npm: "npm",
  "oss-licenses": "OSS licenses",
  pnpm: "pnpm",
  swiftui: "SwiftUI",
  typescript: "TypeScript",
  xcode: "Xcode",
};

export function getBreadcrumbTitle(segment: string): string {
  return breadcrumbTitles[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1).replaceAll("-", " ");
}

export function getDocPath(id = ""): string {
  return getRelativeLocaleUrl(baseLocale, id ? `/docs/cheatsheets/${id}/` : "/docs/cheatsheets/");
}
