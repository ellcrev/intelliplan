import fetchXML from "./subject-code-courses/fetch_xml";
import convertXML2JSON from "./subject-code-courses/convert_xml_to_json";
import parseJSON from "./subject-code-courses/parse_json";
import { isMainThread, parentPort } from "worker_threads";
import { TaskFinished, TaskUpdated } from "../helpers/threadpool";
import saveJSON from "../helpers/save_and_prettify_json";
import path from "node:path";

/**
 * This function does 4 primary things:
 * - Fetches XML Data from ExploreCourses for a subject code
 * - Converts the XML Data to JSON.
 * - Parses the JSON into a relevant types.
 * - Determines GPT tokens needed for each course.
 *
 * Called & awaited by worker thread below and
 * sends the results to the main thread.
 */
const pullSubjectCodeCourses = async (
  subjectCode: string,
  timestamp: string,
) => {
  const updateMessage: TaskUpdated = {
    status: "UPDATE",
    message: `Fetching XML for ${subjectCode} courses...`,
  };
  parentPort?.postMessage(updateMessage);
  const rawSubjectCodeCoursesXML = await fetchXML(subjectCode);
  updateMessage.message = `Converting XML to JSON for ${subjectCode} courses...`;
  parentPort?.postMessage(updateMessage);
  const rawSubjectCodeCoursesJSON = await convertXML2JSON(
    rawSubjectCodeCoursesXML,
  );
  await saveJSON(
    path.join(process.cwd(), "data", "raw"),
    rawSubjectCodeCoursesJSON,
    subjectCode,
    timestamp,
  );
  updateMessage.message = `Parsing JSON for ${subjectCode} courses...`;
  parentPort?.postMessage(updateMessage);
  const parsedSubjectCodeCoursesObject = await parseJSON(
    rawSubjectCodeCoursesJSON,
  );
  await saveJSON(
    path.join(process.cwd(), "data", "parsed"),
    parsedSubjectCodeCoursesObject,
    subjectCode,
    timestamp,
  );
  return parsedSubjectCodeCoursesObject;
};

/**
 * This code is executed whenever this file
 * is imported as a Worker from worker_threads.
 * It waits for the parent to send an input,
 * invokes and awaits pullWorker function above,
 * and then sends the results to the main thread.
 * Repeats the loop and continues to wait for a
 * new input from the parent thread.
 */
while (!isMainThread && parentPort) {
  // (1) Wait for the parent to send the input args
  const { subjectCode, timestamp } = await new Promise<PullWorkerInput>(
    (res) => {
      parentPort?.on("message", (input: PullWorkerInput) => {
        res(input);
      });
    },
  );

  // (2) Execute the input args on the function
  const results = await pullSubjectCodeCourses(subjectCode, timestamp);

  // (3) Update the parent that the function has finished
  const finishMessage: TaskFinished<typeof results> = {
    status: "FINISH",
    data: results,
  };

  parentPort.postMessage(finishMessage);
  // Repeat in while loop to await next message from parent (ie next task)
}

export type PullWorkerInput = {
  subjectCode: Parameters<typeof pullSubjectCodeCourses>[0];
  timestamp: string;
};
export type PullWorkerOutput = Awaited<
  ReturnType<typeof pullSubjectCodeCourses>
>;

export default pullSubjectCodeCourses;
