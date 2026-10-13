import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DailyLocationMap } from "./DailyLocationMap";
import { LOCATION_COORDINATES } from "./locationCoordinates";

describe("DailyLocationMap", () => {
  it("positions each resource at its registry percentage coordinates", () => {
    render(<DailyLocationMap locations={{ date: "2026-08-31", roamingOak: "ruins", flawlessFluorite: "forest" }} />);
    const oak = screen.getByRole("button", { name: "Roaming Oak Timber: Onsen Mountain Ruins" });
    const fluorite = screen.getByRole("button", { name: "Flawless Fluorite: Spirit-Oak Pine Forest" });
    expect(oak.style.left).toBe(`${LOCATION_COORDINATES.ruins.xPercent}%`);
    expect(oak.style.top).toBe(`${LOCATION_COORDINATES.ruins.yPercent}%`);
    expect(fluorite.style.left).toBe(`${LOCATION_COORDINATES.forest.xPercent}%`);
    expect(fluorite.style.top).toBe(`${LOCATION_COORDINATES.forest.yPercent}%`);
  });

  it("clusters resources that share one location", () => {
    render(<DailyLocationMap locations={{ date: "2026-08-31", roamingOak: "h02", flawlessFluorite: "h02" }} />);
    expect(screen.getByRole("button", { name: /Roaming Oak Timber/ }).className).toContain("heartopia-cluster-1");
    expect(screen.getByRole("button", { name: /Flawless Fluorite/ }).className).toContain("heartopia-cluster-2");
  });
});
