const mongoose = require("mongoose");

const JobMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    preferences: {
      role: String,
      location: String,
      workType: String,
      experienceLevel: String,
      salary: String,
      industry: String,
    },
    profileSummary: String,
    jobs: [
      {
        jobId: String,
        title: String,
        company: String,
        location: String,
        salary: String,
        workType: String,
        postedAt: String,
        applyLink: String,
        requiredSkills: [String],
        description: String,
        matchScore: Number,
        skillsMatch: Number,
        experienceMatch: Number,
        cultureMatch: Number,
        strengths: [String],
        gaps: [String],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("JobMatch", JobMatchSchema);
