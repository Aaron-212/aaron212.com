import type { Locale } from "../../../i18n.config";

const en = {
  tocOnThisPage: "On this page",
  tocAriaLabel: "Table of contents",
};

export const messages = {
  en,
  "zh-cn": {
    tocOnThisPage: "本页内容",
    tocAriaLabel: "目录",
  },
} satisfies Record<Locale, typeof en>;
