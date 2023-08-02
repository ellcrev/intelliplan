import { encode } from "gpt-3-encoder";
import {
  ParsedCourseData,
  ParsedInstructor,
  ParsedSectionData,
  ParsedTermLectureTimes,
  RawCourseData,
  RawSectionData,
} from "../../../lib/meilisearch/types";
import {
  collectDate,
  collectDaysOfWeek,
  collectTerm,
  collectTime,
} from "../../helpers/parsing_helpers";
const parseJSON = async (rawJSON: string) => {
  let data = rawJSON as any;
  /**
   * DEVELOPER NOTE:
   * Add in code block below when developing to get type-safety
   * for the raw course data. Only works when data has been downloaded.
   * Note: You can change AA with any other downloaded subject courses.
   *
   * !!! WARNING !!!
   * Make sure to comment the code block back out after editing this
   * function, otherwise all parsed JSON will be of the subject type below.
   * =======================================================================
   * UNCOMMENT 3 LINES BELOW WHILE EDITING
   */
  // let data = (
  //   await import("../../../data/raw/AA.json", {
  //     assert: { type: "json " },
  //   })
  // ).default;

  let parsedCourses: ParsedCourseData[] = [];
  let parsedSections: ParsedSectionData[] = [];
  let tokens = 0;
  if (data.xml && data.xml.courses && data.xml.courses[0]) {
    let rawCourses = data.xml.courses[0].course ?? [];
    if (rawCourses && rawCourses.length !== 0 && rawCourses[0]) {
      rawCourses.forEach((c: RawCourseData) => {
        const rawSections = c.sections[0].section;
        /** Gather all information needed from section for courses. */
        const topThreeInstructors: ParsedInstructor[] = [];
        const terms: Set<ParsedCourseData["terms"][number]> = new Set();
        let termLectureTimes: ParsedTermLectureTimes = {};
        // Loop through all sections, collecting info for course object as well.
        if (rawSections && rawSections.length) {
          rawSections.forEach((sec: RawSectionData) => {
            const term = collectTerm(sec.term[0]);
            if (term) {
              terms.add(term);
              if (!termLectureTimes[term]) {
                termLectureTimes[term] = [];
              }
            }
            if (
              sec.schedules &&
              sec.schedules[0] &&
              sec.schedules[0].schedule
            ) {
              sec.schedules[0].schedule.forEach((sched) => {
                const startDate = collectDate(sched.startDate[0]);
                const endDate = collectDate(sched.endDate[0]);
                const startTime = collectTime(sched.startTime[0]);
                const endTime = collectTime(sched.endTime[0]);
                const days = collectDaysOfWeek(sched.days[0]);
                const location = sched.location[0];
                // Continue iterating on professors.
                if (
                  sched.instructors &&
                  sched.instructors[0] &&
                  sched.instructors[0].instructor
                ) {
                  sched.instructors[0].instructor.forEach((instr) => {
                    if (
                      (instr.role[0] === "PI" || instr.role[0] === "SI") &&
                      topThreeInstructors.length !== 3
                    ) {
                      topThreeInstructors.push({
                        name: instr.firstName[0] + " " + instr.lastName[0],
                        sunet: instr.sunet[0],
                        role: instr.role[0],
                      });
                    }
                  });
                }
                const sectionObject = {
                  courseId: c.subject[0] + c.code[0],
                  component: sec.component[0],
                  startDate,
                  startTime: startTime?.obj,
                  endDate,
                  endTime: endTime?.obj,
                  startTimeCalString: startTime?.string,
                  endTimeCalString: endTime?.string,
                  dayLetters: days?.dayLetters,
                  dayNumbers: days?.dayNumbers,
                  location,
                };
                // if the section component is a discussion or a lab section
                if (
                  sectionObject.component == "DIS" ||
                  sectionObject.component == "LBS"
                ) {
                  // add it to the parsed sections
                  parsedSections.push(sectionObject);
                } else {
                  // otherwise, this is a lecture time or seminar time and it's important

                  const termNullDefault = term || "SUM"; // TypeScript kept giving an error, so here's some spaghetti
                  termLectureTimes[termNullDefault]!.push(sectionObject);
                }
              });
            } else {
              // Push this as an empty section.
              parsedSections.push({
                courseId: c.subject[0] + c.code[0],
              });
            }
          });
        }
        // Add the course json.
        // [TODO] - This should be generalized for any GPT template.
        tokens += encode(c.description[0]).length;
        // =========================================================
        const parsedCourse: ParsedCourseData = {
          subject: c.subject[0],
          code: c.code[0],
          title: c.title[0],
          description: c.description[0],
          gers: c.gers,
          minUnits: parseInt(c.unitsMin[0]),
          maxUnits: parseInt(c.unitsMax[0]),
          top3Instructors: topThreeInstructors,
          terms: Array.from(terms),
          termLectureTimes,
        };
        parsedCourses.push(parsedCourse);
      });
    }
  }
  return {
    tokens,
    courses: parsedCourses,
    sections: parsedSections,
  };
};

export default parseJSON;
