import convert from 'xml-js';

export const XML2OBJ = (xml) => {
  const jsn = convert.xml2json(xml.toString(), { compact: true });
  return JSON.parse(jsn);
};

export const OBJ2XML = (obj) => convert.json2xml(obj, { compact: true, ignoreComment: true, spaces: 4 });
