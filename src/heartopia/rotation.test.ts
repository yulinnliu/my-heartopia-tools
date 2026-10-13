import { describe, expect, it } from "vitest";
import { addCalendarDays, locationsForDate, todayInHeartopia, upcomingLocations } from "./rotation";

describe("Heartopia rotation", () => {
  it.each([
    ["2026-07-11", "forest", "h08"],
    ["2026-07-12", "h02", "h05"],
    ["2026-07-13", "h01", "h04"],
    ["2026-07-14", "h10", "h11"],
    ["2026-07-15", "h05", "ruins"],
    ["2026-07-16", "h10", "h08"],
    ["2026-07-17", "h04", "h08"],
    ["2026-07-18", "h07", "h02"],
    ["2026-07-19", "h03", "h02"],
    ["2026-07-20", "forest", "h02"],
    ["2026-07-21", "h03", "h01"],
    ["2026-07-22", "h05", "h01"],
    ["2026-07-23", "h12", "h04"],
    ["2026-07-24", "h02", "h08"],
    ["2026-07-25", "h08", "h04"],
    ["2026-07-26", "h04", "h01"],
    ["2026-07-27", "h08", "ruins"],
    ["2026-07-28", "h06", "h08"],
    ["2026-07-29", "h08", "h08"],
    ["2026-07-30", "h12", "h06"],
    ["2026-07-31", "h10", "h02"],
    ["2026-08-01", "h07", "h02"],
    ["2026-08-02", "h12", "ruins"],
    ["2026-08-03", "h08", "h05"],
    ["2026-08-04", "h06", "h11"],
    ["2026-08-05", "h11", "h11"],
    ["2026-08-06", "h02", "h02"],
    ["2026-08-07", "h09", "h12"],
    ["2026-08-08", "h03", "h04"],
    ["2026-08-09", "h06", "h11"],
    ["2026-08-10", "h02", "h07"],
    ["2026-08-11", "h11", "h09"],
    ["2026-08-12", "forest", "h04"],
    ["2026-08-13", "forest", "h04"],
    ["2026-08-14", "h11", "h07"],
    ["2026-08-15", "h09", "h05"],
    ["2026-08-16", "h10", "h03"],
    ["2026-08-17", "h03", "h07"],
    ["2026-08-18", "h06", "h07"],
    ["2026-08-19", "h09", "h01"],
    ["2026-08-20", "h04", "h05"],
    ["2026-08-21", "h10", "h09"],
    ["2026-08-22", "forest", "h11"],
    ["2026-08-23", "h07", "h06"],
    ["2026-08-24", "h06", "h02"],
    ["2026-08-25", "h11", "h02"],
    ["2026-08-26", "h02", "h03"],
    ["2026-08-27", "h12", "h12"],
    ["2026-08-28", "h04", "h11"],
    ["2026-08-29", "h12", "ruins"],
    ["2026-08-30", "forest", "h08"],
    ["2026-08-31", "h02", "h05"],
    ["2026-09-01", "h01", "h04"],
  ])("matches the verified locations for %s", (date, roamingOak, flawlessFluorite) => {
    expect(locationsForDate(date)).toMatchObject({ roamingOak, flawlessFluorite });
  });

  it("wraps after fifty days", () => {
    const anchor = locationsForDate("2026-08-31");
    expect(locationsForDate(addCalendarDays("2026-08-31", 50))).toMatchObject({
      roamingOak: anchor.roamingOak,
      flawlessFluorite: anchor.flawlessFluorite,
    });
  });

  it("changes the effective date at 06:00 UTC+08:00", () => {
    expect(todayInHeartopia(new Date("2026-08-30T21:59:59Z"))).toBe("2026-08-30");
    expect(todayInHeartopia(new Date("2026-08-30T22:00:00Z"))).toBe("2026-08-31");
  });

  it("returns the next seven non-interactive schedule rows", () => {
    const upcoming = upcomingLocations("2026-08-31");
    expect(upcoming).toHaveLength(7);
    expect(upcoming[0]).toMatchObject({ date: "2026-09-01", roamingOak: "h01", flawlessFluorite: "h04" });
    expect(upcoming[6].date).toBe("2026-09-07");
  });
});
