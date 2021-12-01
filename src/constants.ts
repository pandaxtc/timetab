/**
 * @fileoverview This file defines important constants for use in
 * components related to selecting event times and related parameters, like
 * time zones, or days of the week. 
 * @package luxon - This package is used for its API dealing with dates and times
 * @package @vvo/tzdb - This package is used for its list of IANA timezone names
 * and the zones' associated time offset. 
 */
import { rawTimeZones } from "@vvo/tzdb";
import { IANAZone } from "luxon";

export const TIMEZONES = rawTimeZones.map((tz) => ({
  value: tz.name,
  label: `(UTC${new IANAZone(tz.name).formatOffset(
    Date.now(),
    "short"
  )}) ${tz.name.replace("_", " ")}`,
}));

export const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const TIMES = [...Array(24).keys()].map((time) => ({
  value: time,
  label: `${time.toString().padStart(2, "0")}:00`,
}));

export const SUPPORTED_TIME_INCREMENT = 0.5;
