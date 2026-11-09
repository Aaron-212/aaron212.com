import { baseLocale, locales, type Locale } from "../../i18n.config";

export function getLocale(locale: string | undefined): Locale {
  return locales.find((supported) => supported === locale) ?? baseLocale;
}

export function getRoutePath(pathname: string): string {
  const segments = pathname.split("/");
  if (locales.some((locale) => locale === segments[1])) {
    segments.splice(1, 1);
  }

  return segments.join("/") || "/";
}
