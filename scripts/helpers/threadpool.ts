import PQueue from "p-queue";
import { Worker } from "worker_threads";
import { cpus } from "os";
import type { Ora } from "ora";
import getTimestamp from "./get_timestamp";

export interface TaskUpdated {
  status: "UPDATE";
  message: string;
}
export interface TaskFinished<T> {
  status: "FINISH";
  data: T;
}

class ThreadPool<T> {
  private concurrency = cpus().length;
  private completedTasks = 0;
  private q = new PQueue({ concurrency: this.concurrency });
  private workers: { thread: Worker; available: boolean }[] = [];
  private collected: { subjectCode: string; data: T }[] = [];
  private timestamp = getTimestamp();
  private lastLoading: {
    subjectCode: string;
    message: string;
  } | null = null;
  constructor(
    subjectCodes: string[],
    workerType: "pull" | "gpt",
    spinner: Ora,
    timestamp: string,
  ) {
    this.timestamp = timestamp;
    // Determine how many workers to create
    const workerCount =
      subjectCodes.length < this.concurrency
        ? subjectCodes.length
        : this.concurrency;
    spinner.start("Creating " + workerCount + " workers...");

    // Determine the worker URL from workerType.
    const p = workerType === "pull" ? "scrape" : "gpt";
    const workerURL = `./scripts/` + p + "/worker";

    // Create workerCount number of threads.
    this.workers = [...Array(workerCount).keys()].map(() => ({
      thread: new Worker(workerURL, {
        execArgv: ["--loader", "tsx", "--no-warnings"],
      }),
      available: true,
    }));

    // Load the tasks into the queue.
    spinner.start("Loading all " + subjectCodes.length + "  tasks...");
    for (let i = 0; i < subjectCodes.length; i++) {
      const code = subjectCodes[i];
      const task = this.q.add(async () => {
        const result = await new Promise<TaskFinished<T>>(async (res) => {
          // (1) - Get an available worker.
          let availableThread: { thread: Worker; available: boolean } | null;
          while (
            (availableThread =
              this.workers.find((thread) => thread.available) ?? null) &&
            !availableThread
          ) {
            await new Promise<void>((res) => {
              this.q.once("completed", (next) => {
                res();
              });
            });
          }
          if (!availableThread) {
            throw Error("No available thread despite having completed.");
          }
          // (2) - Give the worker a new task.
          availableThread.available = false;
          availableThread.thread.postMessage({
            subjectCode: code,
            timestamp: this.timestamp,
          });
          const cb = (response: TaskUpdated | TaskFinished<T>) => {
            if (response.status === "UPDATE") {
              spinner.start(response.message);
              if (this.lastLoading?.subjectCode !== code) {
                this.lastLoading = {
                  subjectCode: code,
                  message: response.message,
                };
              }
            } else if (response.status === "FINISH") {
              if (availableThread) {
                availableThread.available = true;
                availableThread.thread.off("message", cb);
                this.collected.push({
                  subjectCode: code,
                  data: response.data,
                });
                res(response);
              }
            }
          };
          availableThread.thread.prependListener("message", cb);
        });
        return result;
      });
      // Attach a callback for when the task is done.
      task.then((data) => {
        if (data) {
          this.completedTasks++;
          const message =
            workerType === "gpt"
              ? "Completed GPT keyword generation for "
              : "Completed data pull for ";
          const paddedMessage = (message + code + ".").padEnd(50, " ");
          const progress = `(${this.completedTasks}/${subjectCodes.length})`;
          spinner.succeed(paddedMessage + progress);
          if (this.completedTasks !== subjectCodes.length) {
            spinner.start(this.lastLoading?.message);
          }
        }
      });
    }
  }
  // Waits for all tasks to finish and then terminates all worker threads.
  async waitAndTerminate() {
    await this.q.onIdle();
    await Promise.all(this.workers.map((w) => w.thread.terminate()));
    this.q.pause();
    return this.collected;
  }
}

export default ThreadPool;
