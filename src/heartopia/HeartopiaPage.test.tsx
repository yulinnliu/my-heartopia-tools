import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HeartopiaPage from "./HeartopiaPage";

describe("HeartopiaPage", () => {
  afterEach(() => vi.useRealTimers());

  it("leads with today's map and keeps internal rotation details out of the UI", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-31T12:00:00Z"));
    render(<HeartopiaPage />);

    expect(screen.getByRole("heading", { name: "Daily resource locations" })).toBeTruthy();
    expect(screen.getByText("August 31, 2026 · Updates daily at 06:00 (UTC+8)")).toBeTruthy();
    expect(screen.getByAltText(/Heartopia world map/)).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Roaming Oak Timber" }).parentElement?.textContent).toContain("Plot 2 entrance");
    expect(screen.getByRole("heading", { name: "Flawless Fluorite" }).parentElement?.textContent).toContain("Plot 5 entrance");
    expect(screen.getAllByText("Sep 1")).toHaveLength(1);
    for (const [name, host] of [["Official website", "heartopia.xd.com"], ["Steam", "store.steampowered.com"], ["App Store", "apps.apple.com"], ["Google Play", "play.google.com"]]) {
      expect(screen.getByRole("link", { name }).getAttribute("href")).toContain(host);
    }
    expect(document.body.textContent).toContain("Not affiliated with or endorsed by Heartopia or XD Entertainment");
    expect(screen.getByRole("link", { name: /asset sources/i }).getAttribute("href")).toContain("/ATTRIBUTION.md");

    expect(document.body.textContent).not.toContain("50-day rotation");
    expect(document.body.textContent).not.toContain("Last verified");
    expect(screen.queryByRole("button", { name: /previous|next|today|leave preview/i })).toBeNull();
  });
});
