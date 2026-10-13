import rawRotation from "./data/rotation.json";
import { LOCATION_COORDINATES } from "./locationCoordinates";

const DAY_MS = 86_400_000;
const DAILY_RESET_OFFSET_MS = 6 * 60 * 60 * 1000;
export const HEARTOPIA_TIMEZONE = "Asia/Taipei";

type RotationData = {
  schema_version: number;
  timezone: string;
  anchor_date: string;
  day_order: string;
  columns: string[];
  days: string[][];
};

export type DailyLocations = {
  date: string;
  roamingOak: string;
  flawlessFluorite: string;
};

const rotation: RotationData = rawRotation;

function parseDateOnly(value: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid Heartopia date: ${value}`);
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function positiveModulo(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function validateRotation(): void {
  if (rotation.schema_version !== 1
    || rotation.timezone !== HEARTOPIA_TIMEZONE
    || rotation.day_order !== "anchor_then_previous_days"
    || rotation.columns.join(",") !== "liuliu_oak,flawless_fluorite"
    || rotation.days.length !== 50) {
    throw new Error("Unsupported Heartopia rotation data");
  }
  for (const row of rotation.days) {
    if (row.length !== 2 || row.some((location) => !LOCATION_COORDINATES[location])) {
      throw new Error("Heartopia rotation references an unknown location");
    }
  }
}

validateRotation();

export function todayInHeartopia(now = new Date()): string {
  const resetAdjusted = new Date(now.getTime() - DAILY_RESET_OFFSET_MS);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: HEARTOPIA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(resetAdjusted);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function addCalendarDays(date: string, days: number): string {
  return new Date(parseDateOnly(date) + days * DAY_MS).toISOString().slice(0, 10);
}

export function locationsForDate(date: string): DailyLocations {
  const offset = Math.round((parseDateOnly(rotation.anchor_date) - parseDateOnly(date)) / DAY_MS);
  const index = positiveModulo(offset, rotation.days.length);
  const [roamingOak, flawlessFluorite] = rotation.days[index];
  if (!roamingOak || !flawlessFluorite) throw new Error("Incomplete Heartopia rotation row");
  return { date, roamingOak, flawlessFluorite };
}

export function upcomingLocations(date: string, count = 7): DailyLocations[] {
  return Array.from({ length: count }, (_, index) => locationsForDate(addCalendarDays(date, index + 1)));
}

export function formatHeartopiaDate(date: string, options: Intl.DateTimeFormatOptions = { dateStyle: "long" }, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(new Date(parseDateOnly(date)));
}
