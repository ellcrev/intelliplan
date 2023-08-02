import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

const convertHTML2JSON = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(path.join("file://", process.cwd(), "departments.html"));
  const departments = await page.evaluate(() => {
    const DEPARTMENTS = [
      "Department of Athletics, Physical Education and Recreation",
      "Doerr School of Sustainability",
      "Graduate School of Business",
      "School of Education",
      "School of Engineering",
      "School of Humanities & Sciences",
      "Law School",
      "School of Medicine",
      "Office of Vice Provost for Undergraduate Education",
      "Office of Vice Provost for Teaching and Learning",
    ];
    return Array.from(document.querySelectorAll(".schoolName"))
      .filter((d) => DEPARTMENTS.includes(d.textContent ?? ""))
      .map((elem) => {
        const list1Elem = elem.nextElementSibling;
        const list2Elem = elem.nextElementSibling?.nextElementSibling;
        const lists = [list1Elem, list2Elem];
        const output = {
          departmentGroupName: elem.textContent ?? "",
          departmentCodes: [] as { name: string; code: string }[],
        };
        lists.forEach((l) => {
          if (l) {
            Array.from(l.querySelectorAll("a")).forEach((a) => {
              const text = (a.textContent ?? "").replace(/[\t\n\r]/g, "");
              const parts = text.split("(");
              const name = parts[0].trim();
              const code = parts[parts.length - 1].replace(")", "").trim();
              output.departmentCodes.push({
                name,
                code,
              });
            });
          }
        });
        return output;
      });
  });
  await browser.close();
  await fs.promises.unlink("departments.html");
  return departments;
};

export default convertHTML2JSON;
