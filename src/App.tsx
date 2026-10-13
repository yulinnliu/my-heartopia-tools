import HeartopiaPage from "./heartopia/HeartopiaPage";
import type { Locale } from "./heartopia/i18n";

export default function App({ locale = "en" }: { locale?: Locale }) {
  return <HeartopiaPage locale={locale} />;
}
