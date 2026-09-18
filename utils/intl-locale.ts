const INTL_LOCALES: Record<string, string> = {
  en: "en-US",
  ru: "ru-RU",
  pl: "pl-PL",
};

export function toIntlLocale(locale: string): string {
  return INTL_LOCALES[locale] ?? locale;
}
