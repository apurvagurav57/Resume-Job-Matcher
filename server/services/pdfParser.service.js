const pdfParse = require("pdf-parse");
const axios = require("axios");

const parsePDF = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

const parseFromURL = async (url) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);
  return parsePDF(buffer);
};

module.exports = { parsePDF, parseFromURL };
