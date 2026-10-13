export type LocationKind = "plot" | "forest" | "ruins";

export type MapLocation = {
  label: string;
  kind: LocationKind;
  xPercent: number;
  yPercent: number;
};

export const LOCATION_COORDINATES: Record<string, MapLocation> = {
  h01: { label: "Plot 1 entrance", kind: "plot", xPercent: 36.5, yPercent: 67.9 },
  h02: { label: "Plot 2 entrance", kind: "plot", xPercent: 32.5, yPercent: 60.8 },
  h03: { label: "Plot 3 entrance", kind: "plot", xPercent: 32.2, yPercent: 53.5 },
  h04: { label: "Plot 4 entrance", kind: "plot", xPercent: 30.9, yPercent: 44.7 },
  h05: { label: "Plot 5 entrance", kind: "plot", xPercent: 36.9, yPercent: 34.5 },
  h06: { label: "Plot 6 entrance", kind: "plot", xPercent: 43.4, yPercent: 36.0 },
  h07: { label: "Plot 7 entrance", kind: "plot", xPercent: 51.5, yPercent: 37.5 },
  h08: { label: "Plot 8 entrance", kind: "plot", xPercent: 58.9, yPercent: 39.0 },
  h09: { label: "Plot 9 entrance", kind: "plot", xPercent: 65.9, yPercent: 44.0 },
  h10: { label: "Plot 10 entrance", kind: "plot", xPercent: 65.3, yPercent: 51.8 },
  h11: { label: "Plot 11 entrance", kind: "plot", xPercent: 65.0, yPercent: 60.0 },
  h12: { label: "Plot 12 entrance", kind: "plot", xPercent: 62.5, yPercent: 66.6 },
  ruins: { label: "Onsen Mountain Ruins", kind: "ruins", xPercent: 31.4, yPercent: 22.3 },
  forest: { label: "Spirit-Oak Pine Forest", kind: "forest", xPercent: 78.1, yPercent: 56.9 },
};
