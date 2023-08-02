import { Parser } from "xml2js";

const convertXML2JSON = async (xmlString: string) => {
  const parser = new Parser();
  return parser.parseStringPromise(xmlString) as Promise<string>;
};

export default convertXML2JSON;
