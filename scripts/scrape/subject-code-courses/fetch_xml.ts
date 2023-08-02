import https from "node:https";

/** ========= Explore Courses URL Configuration ============ */
const URL = "https://explorecourses.stanford.edu/search?";
const QUERY_PARAMS = [
  ["view", "xml-20140630"],
  ["q", "_"],
  ["filter-term-Autumn", "on"],
  ["filter-term-Winter", "on"],
  ["filter-term-Spring", "on"],
  ["filter-term-Summer", "on"],
  ["filter-coursestatus-Active", "on"],
];
const getURL = (subjectCode: string) => {
  return (
    URL +
    QUERY_PARAMS.map((e) => e.join("=")).join("&") +
    "&filter-departmentcode-" +
    encodeURIComponent(subjectCode) +
    "=on"
  );
};

const fetchXML = async (subjectCode: string) => {
  return new Promise<string>((resolve, reject) => {
    https.get(getURL(subjectCode), (response) => {
      if (response.statusCode !== 200) {
        return reject(`Invalid status code: ${response.statusCode}`);
      }
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", async () => {
        try {
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    });
  });
};

export default fetchXML;
