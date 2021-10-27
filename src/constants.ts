import { rawTimeZones } from "@vvo/tzdb";
import { IANAZone } from "luxon";

export const TIMEZONES = rawTimeZones.map((tz) => ({
  value: tz.name,
  label: `(UTC${new IANAZone(tz.name).formatOffset(
    Date.now(),
    "short"
  )}) ${tz.name.replace("_", " ")}`,
}));

export const WEEKDAYS = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT"
]