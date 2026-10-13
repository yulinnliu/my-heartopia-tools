// Bakes the date-independent page shell (headline, map image, footer) into one
// HTML file per language so crawlers and link previews see real content, and
// writes each language's head metadata and hreflang links. Today's locations
// are filled in by the browser after load.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, pageMeta, LOCALES, SITE_ORIGIN } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const template = await readFile(path.join(distDir, "index.html"), "utf8");
const placeholder = '<div id="root"></div>';
if (!template.includes(placeholder)) throw new Error("dist/index.html has no empty #root to prerender into");

const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function replaceOnce(html, pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`dist/index.html is missing ${what}`);
  return html.replace(pattern, () => replacement);
}

function setMeta(html, attribute, name, value) {
  const pattern = new RegExp(`(<meta\\s+${attribute}="${name}"\\s+content=")[^"]*(")`);
  if (!pattern.test(html)) throw new Error(`dist/index.html is missing meta ${name}`);
  return html.replace(pattern, (_, open, close) => `${open}${escapeHtml(value)}${close}`);
}

const alternates = [
  ...LOCALES.map((locale) => {
    const meta = pageMeta(locale);
    return `<link rel="alternate" hreflang="${meta.htmlLang}" href="${SITE_ORIGIN}${meta.path}" />`;
  }),
  `<link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${pageMeta("en").path}" />`,
].join("\n    ");

for (const locale of LOCALES) {
  const meta = pageMeta(locale);
  const url = `${SITE_ORIGIN}${meta.path}`;
  let html = template;
  html = replaceOnce(html, /<html lang="[^"]*"/, `<html lang="${meta.htmlLang}"`, "the html lang attribute");
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`, "the title");
  html = replaceOnce(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />\n    ${alternates}`, "the canonical link");
  html = setMeta(html, "name", "description", meta.description);
  html = setMeta(html, "property", "og:title", meta.title);
  html = setMeta(html, "property", "og:description", meta.description);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:image", meta.ogImage);
  html = setMeta(html, "property", "og:locale", meta.ogLocale);
  html = setMeta(html, "name", "twitter:title", meta.title);
  html = setMeta(html, "name", "twitter:description", meta.description);
  html = setMeta(html, "name", "twitter:image", meta.ogImage);
  html = html.replace(placeholder, () => `<div id="root">${render(locale)}</div>`);

  const outFile = path.join(distDir, meta.path === "/" ? "" : meta.path, "index.html");
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, html);
  console.log(`prerendered ${path.relative(root, outFile)}`);
}

await rm(ssrDir, { recursive: true, force: true });
