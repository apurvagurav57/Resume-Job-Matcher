const axios = require("axios");
const mammoth = require("mammoth");
const Resume = require("../models/Resume");
const { parsePDF } = require("../services/pdfParser.service");
const { parseResume: parseWithAI } = require("../services/gemini.service");

const FALLBACK_SKILLS = [
  "javascript",
  "typescript",
  "react",
  "node",
  "express",
  "mongodb",
  "mysql",
  "postgresql",
  "python",
  "java",
  "aws",
  "docker",
  "kubernetes",
  "git",
  "html",
  "css",
  "tailwind",
];

const parseResumeFallback = (text) => {
  const normalized = text || "";
  const lines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const lower = normalized.toLowerCase();

  const emailMatch = normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = normalized.match(
    /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/,
  );
  const expMatch = normalized.match(/(\d{1,2})\+?\s*(?:years?|yrs?)\b/i);

  const skills = FALLBACK_SKILLS.filter((skill) => lower.includes(skill));
  const nameCandidate =
    lines.find(
      (line) => line.length >= 2 && line.length <= 60 && !line.includes("@"),
    ) || null;
  const educationLine =
    lines.find((line) =>
      /(b\.tech|btech|be\b|m\.tech|mtech|bsc|msc|bca|mca|mba|phd|degree|university|college)/i.test(
        line,
      ),
    ) || "";

  return {
    name: nameCandidate,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    skills,
    experienceYears: expMatch ? Number(expMatch[1]) : 0,
    education: educationLine,
    summary: normalized.replace(/\s+/g, " ").trim().slice(0, 320),
    jobTitles: [],
  };
};

const parseDocx = async (fileUrl) => {
  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
  const result = await mammoth.extractRawText({
    buffer: Buffer.from(response.data),
  });
  return (result?.value || "").trim();
};

const buildExtractionFallbackText = (fileName) =>
  `Resume uploaded: ${fileName || "resume"}. Text extraction was limited, so a minimal profile was created. You can improve matching by pasting resume text.`;

const uploadResume = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    let rawText;
    if (req.file.mimetype === "application/pdf") {
      const response = await axios.get(req.file.path, {
        responseType: "arraybuffer",
      });
      rawText = await parsePDF(Buffer.from(response.data));
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      rawText = await parseDocx(req.file.path);
    } else if (req.file.mimetype === "text/plain") {
      const response = await axios.get(req.file.path, { responseType: "text" });
      rawText = response.data;
    } else {
      rawText = "";
    }

    let parsedData;
    let parsingWarning = null;
    const extractedText = String(rawText || "").trim();
    const hasUsableExtractedText = extractedText.length >= 25;
    const persistedRawText = hasUsableExtractedText
      ? extractedText
      : buildExtractionFallbackText(req.file.originalname);

    if (!hasUsableExtractedText) {
      parsedData = parseResumeFallback(persistedRawText);
      parsingWarning =
        "Could not extract enough readable text from the file. Uploaded with a minimal parsed profile. For best results, paste resume text in the Paste tab.";
    } else {
      try {
        parsedData = await parseWithAI(extractedText);
      } catch (aiError) {
        parsedData = parseResumeFallback(extractedText);
        parsingWarning = `AI parsing unavailable: ${aiError.message}`;
      }
    }
    await Resume.updateMany({ userId: req.user._id }, { isActive: false });
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      rawText: persistedRawText,
      parsedData,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      message: parsingWarning
        ? "Resume uploaded with fallback parsing"
        : "Resume uploaded and parsed",
      resume,
      warning: parsingWarning,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const pasteResume = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 50) {
      return res
        .status(400)
        .json({ success: false, message: "Resume text too short" });
    }
    let parsedData;
    let parsingWarning = null;
    try {
      parsedData = await parseWithAI(text);
    } catch (aiError) {
      parsedData = parseResumeFallback(text);
      parsingWarning = `AI parsing unavailable: ${aiError.message}`;
    }
    await Resume.updateMany({ userId: req.user._id }, { isActive: false });
    const resume = await Resume.create({
      userId: req.user._id,
      rawText: text,
      parsedData,
      isActive: true,
    });
    return res.status(200).json({
      success: true,
      resume,
      warning: parsingWarning,
      message: parsingWarning
        ? "Resume saved with fallback parsing"
        : "Resume saved",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMyResume = async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user._id, isActive: true });
  if (!resume) {
    return res.json({
      success: true,
      resume: null,
      message: "No resume found",
    });
  }
  return res.json({ success: true, resume });
};

module.exports = { uploadResume, pasteResume, getMyResume };
