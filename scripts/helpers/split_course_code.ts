/**
 * Splits a course code string into a 2 element array
 * containing its subject code and course number.
 */
const splitCourseCode = (courseCode: string) => {
  const subj = courseCode.match(/^\D+/g);
  if (!subj || subj.length === 0) {
    return ["", courseCode];
  }
  const subject = subj[0];
  const index = courseCode.search(/\d/);
  const num = courseCode.slice(index);
  return [subject, num];
};

export default splitCourseCode;
