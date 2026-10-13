# My Heartopia

**Live site: <https://heartopia.hami-qua.com/>** (English) · <https://heartopia.hami-qua.com/zh-TW/> (繁體中文) · <https://heartopia.hami-qua.com/zh-CN/> (简体中文)

Small utility tools for the game Heartopia.

> **Unofficial.** This is a non-commercial fan project. It is not affiliated
> with or endorsed by Heartopia or its publisher. The rotation schedule is
> community-observed and may change after a game update; it is not live game
> data. See [ATTRIBUTION.md](ATTRIBUTION.md) for asset sources and a removal
> path.

## Daily resource locations

Shows where **Roaming Oak Timber** and **Flawless Fluorite** are today:

- Both locations marked on the world map, with a text summary below it.
- A forecast for the next seven days.

### How the schedule works

The two resources follow a repeating 50-day cycle across the twelve residential
plots, Onsen Mountain Ruins and the Spirit-Oak Pine Forest.

- The game day resets at **06:00 in `Asia/Taipei` (UTC+08:00, no daylight
  saving)**. The date never depends on your device's timezone, so everyone sees
  the same answer at the same moment.
- The page works out today's date when it loads. Reload it after 06:00 (UTC+8)
  to see the new day.
- The map and the text summary show the same locations, and each map marker can
  be reached with the keyboard and read by screen readers.

### Privacy

The site uses [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/)
for anonymous, aggregate page-view counts. It sets no cookies and does not
track individual visitors across sites.

### Accuracy

The cycle was observed by players and calibrated by the project owner. If a
game update changes the rotation, the page can be wrong until it is updated.
Corrections are welcome: please [open an issue](https://github.com/yulinnliu/my-heartopia-tools/issues) with the date,
the resource and where you found it.

## Contributing

Corrections to the schedule or the map positions are the most useful
contribution. The data lives in `src/heartopia/`:

- `data/rotation.json` — the 50-day cycle and the date it is anchored to.
- `locationCoordinates.ts` — each location's English name and its position on
  the map, as a percentage of the map's width and height.
- `i18n.ts` — every visible string, the location and resource names, and the
  page metadata for each language (English, Traditional Chinese and Simplified
  Chinese).

The data is validated when the page loads, so a malformed row or an unknown
location fails the tests instead of showing a wrong answer.

## Run it yourself

Requires Node `24.19.0` and npm `11.17.0` (see `.node-version`).

```powershell
npm ci
npm run dev       # local preview
npm test          # run the tests
npm run build     # production build into dist/, with the static page shell prerendered
```

The site is a static page served from the root of its own domain.
