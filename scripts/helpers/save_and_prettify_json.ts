import fs from "node:fs";
import { spawn } from "node:child_process";

/**
 * A helper function that saves & prettifies
 * JSON given a path, an object/string, and
 * the filename to save it to.
 */
const saveJSON = async (
  p: string,
  obj: any,
  fileNameWithoutExtension: string,
  timestamp: string,
) => {
  if (typeof obj !== "string") {
    obj = JSON.stringify({ ".lastSynced": timestamp, ...obj });
  }
  await fs.promises.writeFile(
    p + "/" + fileNameWithoutExtension + ".json",
    obj,
  );
  await new Promise((res) => {
    spawn(
      "/bin/sh",
      ["-c", "prettier --write " + fileNameWithoutExtension + ".json"],
      {
        cwd: p,
      },
    ).on("exit", res);
  });
};

export default saveJSON;
