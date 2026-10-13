import mapImage from "./assets/heartopia-world-map.webp";
import oakIcon from "./assets/roaming-oak-timber.webp";
import fluoriteIcon from "./assets/flawless-fluorite.webp";
import { MESSAGES, type Locale } from "./i18n";
import { LOCATION_COORDINATES } from "./locationCoordinates";
import type { DailyLocations } from "./rotation";

const RESOURCES = [
  { key: "roamingOak", icon: oakIcon },
  { key: "flawlessFluorite", icon: fluoriteIcon },
] as const;

export function DailyLocationMap({ locations, locale = "en" }: { locations?: DailyLocations; locale?: Locale }) {
  const messages = MESSAGES[locale];
  const sameLocation = locations !== undefined && locations.roamingOak === locations.flawlessFluorite;
  return <figure className="heartopia-map">
    <img draggable={false} className="heartopia-map-image" width={974} height={918} fetchPriority="high" src={mapImage} alt={messages.mapAlt} />
    {locations && RESOURCES.map((resource, index) => {
      const locationId = locations[resource.key];
      const location = LOCATION_COORDINATES[locationId];
      const resourceLabel = messages.resources[resource.key];
      const locationLabel = messages.locationLabel(locationId);
      return <button
        type="button"
        aria-label={messages.markerLabel(resourceLabel, locationLabel)}
        className={`heartopia-map-marker${sameLocation ? ` heartopia-cluster-${index + 1}` : ""}`}
        style={{ left: `${location.xPercent}%`, top: `${location.yPercent}%` }}
        key={resource.key}
      >
        <img draggable={false} src={resource.icon} alt="" width={256} height={256} />
        <span>{resourceLabel}<small>{locationLabel}</small></span>
      </button>;
    })}
  </figure>;
}
