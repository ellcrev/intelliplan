import { AllDataJSON } from "../../lib/meilisearch/types";

/**
 * This function parsed enhanced data
 * into the smallest meilisearch document
 * that it can for indexing on the database.
 *
 * This is the final stage of data transformation.
 */
const mergeGPTData = (allData: AllDataJSON) => {
  const oldCourses = allData.courses.map((c) => ({
    ...c,
    id: c.subject + c.code,
  }));
  const s = new Set<string>();
  const filteredCourses = oldCourses.filter((c) => {
    if (!s.has(c.id)) {
      s.add(c.id);
      return true;
    }
    return false;
  });
  return filteredCourses;
};

export default mergeGPTData;
