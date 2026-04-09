const Resume = require("../models/Resume");
const JobMatch = require("../models/JobMatch");
const { searchJobs } = require("../services/jsearch.service");
const { scoreJobs } = require("../services/gemini.service");
const User = require("../models/User");

const EXPERIENCE_TARGET = {
  entry: 1,
  junior: 2,
  mid: 4,
  senior: 7,
  lead: 9,
};

const uniq = (arr) => [...new Set((arr || []).filter(Boolean))];

const fallbackSummary = (parsedData) => {
  const skills = uniq(parsedData?.skills || []).slice(0, 6);
  const years = parsedData?.experienceYears || 0;
  return `Candidate has ${years} years of experience with strengths in ${skills.join(", ") || "software development"}. Recommended roles are prioritized by skill alignment and profile fit.`;
};

const scoreJobsFallback = (parsedData, jobs, preferences) => {
  const resumeSkills = (parsedData?.skills || []).map((s) =>
    String(s).toLowerCase(),
  );
  const years = Number(parsedData?.experienceYears || 0);
  const targetYears =
    EXPERIENCE_TARGET[
      String(preferences?.experienceLevel || "").toLowerCase()
    ] || 3;

  return jobs.map((job) => {
    const reqSkills = (job.requiredSkills || []).map((s) =>
      String(s).toLowerCase(),
    );
    const overlap = reqSkills.filter((s) => resumeSkills.includes(s));
    const skillsMatch = reqSkills.length
      ? Math.round((overlap.length / reqSkills.length) * 100)
      : 68;

    const expGap = Math.abs(years - targetYears);
    const experienceMatch = Math.max(45, 95 - expGap * 12);
    const cultureMatch = 65 + (overlap.length % 20);
    const matchScore = Math.round(
      skillsMatch * 0.55 + experienceMatch * 0.3 + cultureMatch * 0.15,
    );

    const strengths = [
      overlap.length
        ? `Strong overlap in ${overlap.slice(0, 3).join(", ")}`
        : "Transferable engineering background",
      years
        ? `${years} years of relevant hands-on experience`
        : "Foundational profile suitable for growth role",
      `Role alignment with target ${preferences?.role || job.title}`,
    ].slice(0, 3);

    const gaps = reqSkills.filter((s) => !resumeSkills.includes(s)).slice(0, 3);

    return {
      ...job,
      matchScore,
      skillsMatch,
      experienceMatch,
      cultureMatch,
      strengths,
      gaps,
    };
  });
};

const findMatches = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      userId: req.user._id,
      isActive: true,
    });
    if (!resume)
      return res
        .status(404)
        .json({ success: false, message: "Please upload your resume first" });

    const preferences = req.body;
    const warnings = [];
    let rawJobs = [];
    let source = "jsearch";

    try {
      rawJobs = await searchJobs(
        preferences.role ||
          resume.parsedData?.skills?.[0] ||
          "Software Engineer",
        preferences.location || "India",
        preferences.workType,
      );
    } catch (error) {
      const status = error.statusCode || 500;
      if (status === 401 || status === 403) {
        return res.status(502).json({
          success: false,
          message:
            error.message ||
            "RapidAPI JSearch access failed. Please verify your RapidAPI subscription/key and try again.",
          details: error.message,
        });
      }

      return res.status(502).json({
        success: false,
        message: "JSearch API is temporarily unavailable. Please try again.",
        details: error.message,
      });
    }

    if (!Array.isArray(rawJobs) || rawJobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found from JSearch API for the selected criteria.",
      });
    }

    let profileSummary = fallbackSummary(resume.parsedData || {});
    let mergedJobs = [];

    try {
      const scored = await scoreJobs(
        resume.parsedData || {},
        rawJobs,
        preferences,
      );
      profileSummary = scored.profileSummary || profileSummary;
      mergedJobs = rawJobs.map((job) => {
        const score = scored.jobs?.find((s) => s.jobId === job.jobId) || {};
        return { ...job, ...score };
      });

      if (!mergedJobs.some((j) => Number.isFinite(j.matchScore))) {
        throw new Error("AI scoring returned no usable scores");
      }
    } catch (error) {
      warnings.push(`AI scoring unavailable: ${error.message}`);
      mergedJobs = scoreJobsFallback(
        resume.parsedData || {},
        rawJobs,
        preferences,
      );
    }

    mergedJobs = mergedJobs.sort(
      (a, b) => (b.matchScore || 0) - (a.matchScore || 0),
    );

    await JobMatch.create({
      userId: req.user._id,
      resumeId: resume._id,
      preferences,
      jobs: mergedJobs,
    });
    return res.json({
      success: true,
      count: mergedJobs.length,
      profileSummary,
      jobs: mergedJobs,
      source,
      warnings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const saveJob = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { jobId } = req.params;
  if (!user.savedJobs.includes(jobId)) user.savedJobs.push(jobId);
  await user.save();
  return res.json({ success: true, message: "Job saved" });
};

const getSavedJobs = async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.json({ success: true, savedJobs: user.savedJobs });
};

module.exports = { findMatches, saveJob, getSavedJobs };
