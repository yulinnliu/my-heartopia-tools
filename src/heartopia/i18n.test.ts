import { describe, expect, it } from "vitest";
import { LOCALES, MESSAGES, localeFromPath } from "./i18n";
import { LOCATION_COORDINATES } from "./locationCoordinates";

describe("i18n", () => {
  it("labels every location in every language", () => {
    for (const locale of LOCALES) {
      for (const id of Object.keys(LOCATION_COORDINATES)) {
        expect(MESSAGES[locale].locationLabel(id).length).toBeGreaterThan(0);
      }
    }
  });

  it("uses the in-game Traditional Chinese names", () => {
    const zh = MESSAGES["zh-TW"];
    expect(zh.resources).toEqual({ roamingOak: "溜溜橡木", flawlessFluorite: "無暇螢石" });
    expect([1, 12].map((n) => zh.locationLabel(`h${String(n).padStart(2, "0")}`))).toEqual(["1號家園入口", "12號家園入口"]);
    expect([zh.locationLabel("ruins"), zh.locationLabel("forest")]).toEqual(["溫泉山遺跡", "靈橡松林"]);
  });

  it("uses the Simplified Chinese names", () => {
    const zh = MESSAGES["zh-CN"];
    expect(zh.resources).toEqual({ roamingOak: "溜溜橡木", flawlessFluorite: "无瑕萤石" });
    expect([zh.locationLabel("h01"), zh.locationLabel("h12")]).toEqual(["1号家园入口", "12号家园入口"]);
    expect([zh.locationLabel("ruins"), zh.locationLabel("forest")]).toEqual(["温泉山遗迹", "灵橡松林"]);
    expect(zh.officialLinkKeys).toEqual(["website", "steam"]);
  });

  it("picks the language from the URL path and ", () => {
    expect(localeFromPath("/")).toBe("en");
    expect(localeFromPath("/zh-TW/")).toBe("zh-TW");
    expect(localeFromPath("/zh-CN/")).toBe("zh-CN");
    expect(MESSAGES.en.path).toBe("/");
    expect(MESSAGES["zh-TW"].path).toBe("/zh-TW/");
    expect(MESSAGES["zh-CN"].path).toBe("/zh-CN/");
  });
});
