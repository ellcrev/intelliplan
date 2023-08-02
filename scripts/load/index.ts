import { ChildProcess, spawn } from "child_process";
import path from "node:path";
import tcpPortUsed from "tcp-port-used";
import fs from "node:fs";
import mergeGPTData from "./merge_gpt_data";
import meiliParse from "./meili_parse";
import { AllDataJSON } from "../../lib/meilisearch/types";

/**
 * This script instantiates the local meilisearch
 * instance with data that was pulled from "npm run pull".
 */
// (1) Open Meilisearch if not already opened.
const load = async () => {
  const dbIsOpen = await tcpPortUsed.check(7700, "localhost");
  let ps: ChildProcess | null = null;
  if (!dbIsOpen) {
    ps = spawn("./meilisearch", ["--no-analytics"], {
      cwd: path.join(process.cwd(), "lib", "meilisearch", ".instance"),
      stdio: "inherit",
    });
    // Wait a bit for threads to start
    await new Promise((res) => {
      setTimeout(res, 4000);
    });
  }
  // (2) Read in master courses/sections from parsed data.
  const allDataBuffer = await fs.promises.readFile(
    path.join(process.cwd(), "data", "parsed", ".all-courses.json"),
  );
  const allData = JSON.parse(allDataBuffer.toString()) as AllDataJSON;

  // (3) Merge all available GPT3 data with parsed data.
  const enhancedData = mergeGPTData(allData);

  // (4) Reparse into smallest possible documents for Meilisearch.
  const meiliData = meiliParse(enhancedData);

  // (5) Bulk upload the documents, waiting to be notified when added.
  const meili = (await import("../../lib/meilisearch/index")).default;
  await meili.deleteIndexIfExists("courses");
  await meili.index("courses").addDocumentsInBatches(meiliData, 50);

  return ps;
};

export default load;
