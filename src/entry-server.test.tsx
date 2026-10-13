import { describe, expect, it, vi } from "vitest";
import { render } from "./entry-server";

describe("prerendered page", () => {
  const html = render();

  it("contains the date-independent content", () => {
    expect(html).toContain("Daily resource locations");
    expect(html).toContain("Official website");
    expect(html).toContain("heartopia-map-image");
  });

  it("leaves today's date and locations to the browser", () => {
    expect(html).not.toContain("heartopia-date");
    expect(html).not.toContain("heartopia-map-marker");
    expect(html).not.toContain("Upcoming locations");
  });
});

describe("zh-TW prerendered page", () => {
  const html = render("zh-TW");

  it("renders the page shell in Traditional Chinese with a link back to English", () => {
    expect(html).toContain("每日資源位置");
    expect(html).toContain("官方網站");
    expect(html).toContain("並非官方網站");
    expect(html).toContain("心動小鎮");
    expect(html).toContain('href="/" hrefLang="en"');
    expect(html).not.toContain("Daily resource locations");
  });
});

describe("image dragging", () => {
  it("keeps every image from being dragged out of the page", () => {
    const html = render();
    const images = html.match(/<img [^>]*>/g) ?? [];
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) expect(image).toContain('draggable="false"');
  });
});

describe("language switcher", () => {
  it("lists every language in a fixed order and marks the current one", () => {
    for (const locale of ["en", "zh-TW", "zh-CN"] as const) {
      const html = render(locale);
      expect(html.indexOf("English")).toBeLessThan(html.indexOf("繁體中文"));
      expect(html.indexOf("繁體中文")).toBeLessThan(html.indexOf("简体中文"));
      expect(html.match(/aria-current="true"/g)).toHaveLength(1);
      expect(html.match(/hrefLang=/g)).toHaveLength(2);
    }
  });
});

describe("zh-CN prerendered page", () => {
  const html = render("zh-CN");

  it("renders the page shell in Simplified Chinese with only the official links that apply", () => {
    expect(html).toContain("每日资源位置");
    expect(html).toContain("心动小镇");
    expect(html).toContain("官方网站");
    expect(html).toContain(">Steam<");
    expect(html).not.toContain("App Store");
    expect(html).not.toContain("Google Play");
    expect(html).not.toContain("每日資源位置");
    expect(html).toContain('href="/zh-TW/" hrefLang="zh-TW"');
    expect(html).toContain('href="/" hrefLang="en"');
  });
});

describe("hydration", () => {
  it("hydrates the prerendered markup without a mismatch and then fills in today", async () => {
    const { act } = await import("react");
    const { hydrateRoot } = await import("react-dom/client");
    const { default: App } = await import("./App");
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    const errors: unknown[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...args) => { errors.push(args); });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-31T12:00:00Z"));
    const container = document.createElement("div");
    container.innerHTML = render();
    document.body.append(container);
    await act(async () => { hydrateRoot(container, <App />); });
    expect(errors).toEqual([]);
    expect(container.querySelector(".heartopia-date")?.textContent).toContain("August 31, 2026");
    expect(container.querySelectorAll(".heartopia-map-marker")).toHaveLength(2);
    const images = [...container.querySelectorAll("img")];
    expect(images.length).toBeGreaterThan(5);
    expect(images.every((image) => image.getAttribute("draggable") === "false")).toBe(true);
    spy.mockRestore();
    vi.useRealTimers();
    container.remove();
  });
});

describe("zh-TW hydration", () => {
  it("hydrates and shows Traditional Chinese names for today", async () => {
    const { act } = await import("react");
    const { hydrateRoot } = await import("react-dom/client");
    const { default: App } = await import("./App");
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    const errors: unknown[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...args) => { errors.push(args); });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-31T12:00:00Z"));
    const container = document.createElement("div");
    container.innerHTML = render("zh-TW");
    document.body.append(container);
    await act(async () => { hydrateRoot(container, <App locale="zh-TW" />); });
    expect(errors).toEqual([]);
    expect(container.querySelector(".heartopia-date")?.textContent).toContain("2026年8月31日 · 每天早上 6 點更新（UTC+8）");
    expect(container.textContent).toContain("溜溜橡木");
    expect(container.textContent).toContain("2號家園入口");
    expect(container.textContent).toContain("5號家園入口");
    expect(container.textContent).toContain("App Store");
    spy.mockRestore();
    vi.useRealTimers();
    container.remove();
  });
});
