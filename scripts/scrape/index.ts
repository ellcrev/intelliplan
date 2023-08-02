/**
 * =======================================
 * $ npm run scrape
 * =======================================
 * This script is used to scrape all course data
 * from the ExploreCourses site. It first uses
 * puppeteer to scrape all the department codes
 * from explore courses /browse. Once it has
 * a list of all subject codes, it spawns
 * a worker pool to simultaneously run the
 * fetch/convert/parse tasks on each subject
 * code's course & section lists from XML.
 *
 *  View Pulled Data
 * =======================================
 * /data/raw/[SUBJECT].json
 * /data/parsed/[SUBJECT].json
 * /data/parsed/.departments.json
 * /data/parsed/.all.json
 */
import ora from "ora";
import fetchHTML from "./department-groups/fetch_html";
import convertHTML2JSON from "./department-groups/convert_html_to_json";
import ThreadPool from "../helpers/threadpool";
import { PullWorkerOutput } from "./worker";
import saveJSON from "../helpers/save_and_prettify_json";
import path from "node:path";
import fs from "node:fs";
import getTimestamp from "../helpers/get_timestamp";

// (1) Fetch /browse html from explore courses.
const spinner = ora().start(
  "Fetching department html from explorecourses.com/browse...",
);
await fetchHTML();
spinner.succeed("Successfully downloaded departments.html");

// (2) Use Puppeteer to scrape department groups & subject codes into JSON.
spinner.text = "Scraping department groups & subject codes into JSON...";
const departments = await convertHTML2JSON();
const subjectCodes = departments
  .map(({ departmentCodes }) => departmentCodes.flat())
  .flat(1)
  .map(({ code }) => code)
  .filter((value, index, self) => self.indexOf(value) === index);

// (3) Validate /data exists as well as /data/raw & /data/parsed.
try {
  await fs.promises.access(path.join("data"));
} catch (e) {
  await fs.promises.mkdir(path.join("data"));
}
try {
  await fs.promises.access(path.join("data/raw"));
} catch (e) {
  await fs.promises.mkdir(path.join("data/raw"));
}
try {
  await fs.promises.access(path.join("data/parsed"));
} catch (e) {
  await fs.promises.mkdir(path.join("data/parsed"));
}

// (4) Save the department groups & subject codes to data/parsed/.departments.json.
const timestamp = getTimestamp();
await saveJSON(
  path.join(process.cwd(), "data", "parsed"),
  { departments },
  ".departments",
  timestamp,
);
spinner.succeed(
  "Successfully scraped departments. 'data/parsed/.departments.json'",
);

// (5) Create a thread pool to concurrently fetch/convert/pull all courses.
const pool = new ThreadPool<PullWorkerOutput>(
  subjectCodes,
  "pull",
  spinner,
  timestamp,
);
const results = await pool.waitAndTerminate();

// (6) Combine the results into one large JSON.
spinner.start(
  "Combining all courses into one JSON. 'data/parses/.all-courses.json'",
);
const allData = results.map((entry) => entry.data);
const allCourses = allData.reduce(
  (courses, item) => [...courses, ...item.courses],
  [] as Array<any>,
);
const allSections = allData.reduce(
  (sections, item) => [...sections, ...item.sections],
  [] as Array<any>,
);
const totalTokens = allData.reduce((sum, item) => sum + item.tokens, 0);

// (7) Create the large global JSON for meilisearch.
await saveJSON(
  path.join(process.cwd(), "data", "parsed"),
  { courses: allCourses, sections: allSections },
  ".all-courses",
  timestamp,
);

// (8) Create the stats sheet for info on all course/sections.
await saveJSON(
  path.join(process.cwd(), "data", "parsed"),
  {
    totalCourses: allCourses.length,
    totalSections: allSections.length,
    totalTokens,
  },
  ".stats",
  timestamp,
);
spinner.succeed(
  "Completed all data fetching & parsing (saved in 'data/parsed').",
);

export default {};
