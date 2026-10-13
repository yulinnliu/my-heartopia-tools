import { LOCATION_COORDINATES } from "./locationCoordinates";

export type Locale = "en" | "zh-TW" | "zh-CN";
export const LOCALES: readonly Locale[] = ["en", "zh-TW", "zh-CN"];
export const SITE_ORIGIN = "https://heartopia.hami-qua.com";

type ResourceKey = "roamingOak" | "flawlessFluorite";
export type OfficialLinkKey = "website" | "steam" | "appStore" | "googlePlay";

export type Messages = {
  htmlLang: string;
  intlLocale: string;
  path: string;
  switchLabel: string;
  ogLocale: string;
  ogImage: string;
  title: string;
  description: string;
  kicker: string;
  heading: string;
  dateNote: string;
  todayAria: string;
  upcoming: string;
  mapAlt: string;
  markerLabel: (resource: string, location: string) => string;
  resources: Record<ResourceKey, string>;
  officialIntro: string;
  officialLinks: Record<OfficialLinkKey, string>;
  officialLinkKeys: readonly OfficialLinkKey[];
  sourceNote: string;
  disclaimer: string;
  attribution: string;
  locationLabel: (id: string) => string;
};

const PLOT_ID = /^h(\d{2})$/;

export const MESSAGES: Record<Locale, Messages> = {
  en: {
    htmlLang: "en",
    intlLocale: "en-US",
    path: "/",
    switchLabel: "English",
    ogLocale: "en_US",
    ogImage: `${SITE_ORIGIN}/og.jpg`,
    title: "My Heartopia — Daily Roaming Oak Timber & Flawless Fluorite Locations",
    description: "Where are Roaming Oak Timber and Flawless Fluorite in Heartopia today? A daily map plus a seven-day forecast. Unofficial, community-observed guide that updates daily at 06:00 (UTC+8).",
    kicker: "Heartopia",
    heading: "Daily resource locations",
    dateNote: "Updates daily at 06:00 (UTC+8)",
    todayAria: "Today's resource locations",
    upcoming: "Upcoming locations",
    mapAlt: "Heartopia world map with twelve residential plots, the forest, and Onsen Mountain",
    markerLabel: (resource, location) => `${resource}: ${location}`,
    resources: { roamingOak: "Roaming Oak Timber", flawlessFluorite: "Flawless Fluorite" },
    officialIntro: "New to Heartopia? Get the game (official links):",
    officialLinks: { website: "Official website", steam: "Steam", appStore: "App Store", googlePlay: "Google Play" },
    officialLinkKeys: ["website", "steam", "appStore", "googlePlay"],
    sourceNote: "Locations are community-sourced and may change after a game update.",
    disclaimer: "Unofficial personal fan project. Not affiliated with or endorsed by Heartopia or XD Entertainment.",
    attribution: "Asset sources and removal requests",
    locationLabel: (id) => LOCATION_COORDINATES[id].label,
  },
  "zh-TW": {
    htmlLang: "zh-TW",
    intlLocale: "zh-TW",
    path: "/zh-TW/",
    switchLabel: "繁體中文",
    ogLocale: "zh_TW",
    ogImage: `${SITE_ORIGIN}/og-zh-TW.jpg`,
    title: "My Heartopia 心動小鎮 — 每日溜溜橡木・無暇螢石位置",
    description: "今天溜溜橡木和無暇螢石在心動小鎮的哪裡？提供每日地圖與未來七天預告。玩家社群整理的非官方資訊，每天早上 6 點更新（UTC+8）。",
    kicker: "心動小鎮",
    heading: "每日資源位置",
    dateNote: "每天早上 6 點更新（UTC+8）",
    todayAria: "今日資源位置",
    upcoming: "未來幾天的位置",
    mapAlt: "心動小鎮世界地圖，標示十二個家園、森林與溫泉山",
    markerLabel: (resource, location) => `${resource}：${location}`,
    resources: { roamingOak: "溜溜橡木", flawlessFluorite: "無暇螢石" },
    officialIntro: "還沒開始玩心動小鎮嗎？前往官方下載連結：",
    officialLinks: { website: "官方網站", steam: "Steam", appStore: "App Store", googlePlay: "Google Play" },
    officialLinkKeys: ["website", "steam", "appStore", "googlePlay"],
    sourceNote: "地點由玩家社群整理，遊戲更新後可能變動。",
    disclaimer: "本站是玩家自製的粉絲小工具，並非官方網站，與心動小鎮及 XD Entertainment 沒有隸屬關係，實際內容請以遊戲內為準。",
    attribution: "素材來源與移除請求",
    locationLabel: (id) => {
      const plot = PLOT_ID.exec(id);
      if (plot) return `${Number(plot[1])}號家園入口`;
      if (id === "ruins") return "溫泉山遺跡";
      if (id === "forest") return "靈橡松林";
      throw new Error(`No zh-TW label for location ${id}`);
    },
  },
  "zh-CN": {
    htmlLang: "zh-CN",
    intlLocale: "zh-CN",
    path: "/zh-CN/",
    switchLabel: "简体中文",
    ogLocale: "zh_CN",
    ogImage: `${SITE_ORIGIN}/og-zh-CN.jpg`,
    title: "My Heartopia 心动小镇 — 每日溜溜橡木・无瑕萤石位置",
    description: "今天溜溜橡木和无瑕萤石在心动小镇的哪里？提供每日地图与未来七天预告。玩家社区整理的非官方信息，每天早上 6 点更新（UTC+8）。",
    kicker: "心动小镇",
    heading: "每日资源位置",
    dateNote: "每天早上 6 点更新（UTC+8）",
    todayAria: "今日资源位置",
    upcoming: "未来几天的位置",
    mapAlt: "心动小镇世界地图，标示十二个家园、森林与温泉山",
    markerLabel: (resource, location) => `${resource}：${location}`,
    resources: { roamingOak: "溜溜橡木", flawlessFluorite: "无瑕萤石" },
    officialIntro: "还没开始玩心动小镇吗？前往官方下载链接：",
    officialLinks: { website: "官方网站", steam: "Steam", appStore: "App Store", googlePlay: "Google Play" },
    officialLinkKeys: ["website", "steam"],
    sourceNote: "地点由玩家社区整理，游戏更新后可能变动。",
    disclaimer: "本站是玩家自制的粉丝小工具，并非官方网站，与心动小镇及 XD Entertainment 没有隶属关系，实际内容请以游戏内为准。",
    attribution: "素材来源与移除请求",
    locationLabel: (id) => {
      const plot = PLOT_ID.exec(id);
      if (plot) return `${Number(plot[1])}号家园入口`;
      if (id === "ruins") return "温泉山遗迹";
      if (id === "forest") return "灵橡松林";
      throw new Error(`No zh-CN label for location ${id}`);
    },
  },
};

export function localeFromPath(pathname: string): Locale {
  if (pathname.startsWith("/zh-TW")) return "zh-TW";
  if (pathname.startsWith("/zh-CN")) return "zh-CN";
  return "en";
}
