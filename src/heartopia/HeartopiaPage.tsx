import { useEffect, useState } from "react";
import oakIcon from "./assets/roaming-oak-timber.webp";
import fluoriteIcon from "./assets/flawless-fluorite.webp";
import { DailyLocationMap } from "./DailyLocationMap";
import { LOCALES, MESSAGES, type Locale } from "./i18n";
import { formatHeartopiaDate, locationsForDate, todayInHeartopia, upcomingLocations } from "./rotation";

const RESOURCE_DETAILS = [
  { key: "roamingOak", icon: oakIcon },
  { key: "flawlessFluorite", icon: fluoriteIcon },
] as const;

const OFFICIAL_LINK_HREFS = {
  website: "https://heartopia.xd.com/",
  steam: "https://store.steampowered.com/app/4025700",
  appStore: "https://apps.apple.com/app/id6746151928",
  googlePlay: "https://play.google.com/store/apps/details?id=com.xd.xdtglobal.gp",
} as const;

export default function HeartopiaPage({ locale = "en" }: { locale?: Locale }) {
  const messages = MESSAGES[locale];
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(todayInHeartopia()), []);

  const locations = today ? locationsForDate(today) : undefined;
  const upcoming = today ? upcomingLocations(today) : [];

  return <main className="heartopia-shell">
    <div className="heartopia-page">
      <nav className="heartopia-lang" aria-label="Language">
        {LOCALES.map((code) => code === locale
          ? <span aria-current="true" lang={MESSAGES[code].htmlLang} key={code}>{MESSAGES[code].switchLabel}</span>
          : <a href={MESSAGES[code].path} hrefLang={MESSAGES[code].htmlLang} lang={MESSAGES[code].htmlLang} key={code}>{MESSAGES[code].switchLabel}</a>)}
      </nav>
      <header className="heartopia-header">
        <p className="heartopia-kicker">{messages.kicker}</p>
        <h1>{messages.heading}</h1>
        {today && <p className="heartopia-date">{formatHeartopiaDate(today, undefined, messages.intlLocale)} · {messages.dateNote}</p>}
      </header>

      <DailyLocationMap locations={locations} locale={locale} />

      {locations && <section className="heartopia-resource-grid" aria-label={messages.todayAria}>
        {RESOURCE_DETAILS.map((resource) => <article className={`heartopia-resource-card heartopia-${resource.key}`} key={resource.key}>
          <img draggable={false} src={resource.icon} alt="" width={256} height={256} />
          <div><h2>{messages.resources[resource.key]}</h2><p>{messages.locationLabel(locations[resource.key])}</p></div>
        </article>)}
      </section>}

      {today && <section className="heartopia-upcoming">
        <h2>{messages.upcoming}</h2>
        <div className="heartopia-upcoming-list">
          {upcoming.map((day) => <div className="heartopia-upcoming-row" key={day.date}>
            <time dateTime={day.date}>{formatHeartopiaDate(day.date, { month: "short", day: "numeric" }, messages.intlLocale)}</time>
            <span><img draggable={false} src={oakIcon} alt="" width={256} height={256} loading="lazy" />{messages.locationLabel(day.roamingOak)}</span>
            <span><img draggable={false} src={fluoriteIcon} alt="" width={256} height={256} loading="lazy" />{messages.locationLabel(day.flawlessFluorite)}</span>
          </div>)}
        </div>
      </section>}

      <footer className="heartopia-footer">
        <p className="heartopia-official">{messages.officialIntro}{" "}
          {messages.officialLinkKeys.map((key, index) => <span key={key}>
            {index > 0 && " · "}
            <a href={OFFICIAL_LINK_HREFS[key]} target="_blank" rel="noopener noreferrer">{messages.officialLinks[key]}</a>
          </span>)}
        </p>
        <p>{messages.sourceNote}</p>
        <p>{messages.disclaimer}</p>
        <p><a href="https://github.com/yulinnliu/my-heartopia-tools/blob/main/ATTRIBUTION.md" target="_blank" rel="noopener noreferrer">{messages.attribution}</a></p>
      </footer>
    </div>
  </main>;
}
