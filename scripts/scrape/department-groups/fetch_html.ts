import https from "node:https";
import fs from "node:fs";

const URL = "https://explorecourses.stanford.edu/browse";
const fetchHTML = async () => {
  await new Promise<void>((resolve) => {
    https.get(URL, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream("departments.html");
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      }
    });
  });
};

export default fetchHTML;
