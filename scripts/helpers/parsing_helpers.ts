import {
  ParsedSectionData,
  RawInstructor,
  Quarter,
} from "../../lib/meilisearch/types";

export const sanitize = (str: string) => {
  return str.replace(/[\t\n\r]/g, "");
};

// Collects the days of the week section takes place.
const rawDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const filteredDays = ["M", "T", "W", "Th", "F"];
export const collectDaysOfWeek = (str: string) => {
  if (!str) {
    return undefined;
  }
  const cleanedString = sanitize(str);
  const dayWords = rawDays
    .map((day, index) => ({ day, index }))
    .filter(({ day }) => cleanedString.includes(day));
  const dayLetters = dayWords.map(
    ({ index }) => filteredDays[index],
  ) as ParsedSectionData["dayLetters"];
  const dayNumbers = dayWords.map(
    ({ index }) => index + 1,
  ) as ParsedSectionData["dayNumbers"];
  return { dayLetters, dayNumbers };
};

// Converts a string in "Month DD, YY" to an array
// of a numbers that represent the month day and year.
export const collectDate = (str: string) => {
  if (!str) {
    return undefined;
  }
  const date = new Date(str + ", 00:00:00");
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const yyyy = date.getFullYear();
  return {
    m: mm,
    d: dd,
    y: yyyy,
  };
};

export const collectTime = (str: string) => {
  if (!str) {
    return undefined;
  }
  // note that using date string will mess up if data parsed in non-Stanford timezone
  // also this might cause 1-hour off issues because of daylight savings time
  // as classes in fall/spring quarter might be "offset" by one?
  const time = new Date("January 1, 2000 " + str);
  const hours = time.getHours();
  const minutes = time.getMinutes();
  return { string: `${hours}:${minutes}`, obj: { h: hours, m: minutes } };
};

export const collectTerm = (str: string) => {
  if (!str) {
    return undefined;
  }
  const seasons = {
    Winter: "WIN",
    Autumn: "AUT",
    Spring: "SPR",
    Summer: "SUM",
  } as const;
  const season = str.split(" ")[1];
  return seasons[season] as Quarter;
};

export const collectTopThreeInstructors = (instructorList: RawInstructor[]) => {
  const topThree: { name: string; sunet: string; role: "SI" | "PI" }[] = [];
  for (let i = 0; i < instructorList.length; i++) {
    if (topThree.length === 3) {
      break;
    }
    if (
      instructorList[i].role[0] === "PI" ||
      instructorList[i].role[0] === "SI"
    ) {
      topThree.push({
        name:
          instructorList[i].firstName[0] + " " + instructorList[i].lastName[0],
        sunet: instructorList[i].sunet[0],
        role: instructorList[i].role[0] as "SI" | "PI",
      });
    }
  }
  return topThree;
};
