/**
 * This script is used to initialize all packages
 * for the development environment as well as data
 * for application development.
 */

import { spawn, spawnSync } from "child_process";
import path from "node:path";
import fs from "node:fs";
import Ora from "ora";

// (1) Install husky pre-commit hooks.
const spinner = Ora().start("Installing husky pre-commit scripts.");
spawnSync("npm", ["pkg", "set", "scripts.prepare=husky install"]);
spawnSync("npm", ["run", "prepare"]);
spawnSync("npm", ["pkg", "delete", "scripts.prepare"]);
spinner.succeed("Successfully installed husky.");

// (2) Download Meilisearch.
spinner.info("Downloading Meilisearch...");
try {
  await fs.promises.mkdir(
    path.join(process.cwd(), "lib", "meilisearch", ".instance"),
  );
} catch {}
await new Promise((res) =>
  spawn("/bin/sh", ["-c", "curl -L https://install.meilisearch.com | sh"], {
    cwd: path.join(process.cwd(), "lib", "meilisearch", ".instance"),
    stdio: "inherit",
  }).on("exit", res),
);
spinner.succeed("Succesfully downloaded Meilisearch.");

// (3) Pull course data.
await new Promise((res) =>
  spawn("npm", ["run", "scrape"], {
    cwd: path.join(process.cwd()),
    stdio: "inherit",
  }).on("exit", res),
);

spinner.succeed("Application Ready! Use 'npm run dev' to start developing.");

export default {};
