export const localeDefinitions = [
  {
    locale: "en",
    hreflang: "en",
  },
  {
    locale: "zh-cn",
    hreflang: "zh-CN",
  },
] as const;

export const baseLocale = "en" satisfies (typeof localeDefinitions)[number]["locale"];
export const locales = localeDefinitions.map(({ locale }) => locale);

export type Locale = (typeof locales)[number];
