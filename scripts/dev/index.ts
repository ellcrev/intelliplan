/**
 * This script runs the "next dev" process
 * and the Meilisearch local instance process
 * together in the same shell for development
 * convenience.
 */

import { spawn, spawnSync } from "child_process";
import load from "../load";

// Load in parsed data
const meiliPS = await load();

const nextPS = spawn("npm", ["run", "next_dev"], {
  stdio: "inherit",
});

const exit = new Promise((res) => {
  nextPS.on("exit", res);
  meiliPS?.on("exit", res);
});

setTimeout(() => {
  console.log("✅ Website & Database Ready");
  console.log("View Local Website @ http://localhost:3000");
  console.log("View Local Database @ http://localhost:7700");
}, 3000);

await exit;

process.on("SIGINT", () => {
  meiliPS?.kill();
  nextPS.kill();
  try {
    spawnSync("killall node");
  } catch (e) {}
});

export default {};
