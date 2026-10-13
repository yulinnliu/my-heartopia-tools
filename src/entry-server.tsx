import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { LOCALES, MESSAGES, SITE_ORIGIN, type Locale } from "./heartopia/i18n";

export { LOCALES, SITE_ORIGIN };

export function render(locale: Locale = "en"): string {
  return renderToString(<StrictMode><App locale={locale} /></StrictMode>);
}

export function pageMeta(locale: Locale) {
  const messages = MESSAGES[locale];
  return {
    htmlLang: messages.htmlLang,
    path: messages.path,
    ogLocale: messages.ogLocale,
    ogImage: messages.ogImage,
    title: messages.title,
    description: messages.description,
  };
}
