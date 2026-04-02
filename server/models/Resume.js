const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: String,
    fileUrl: String,
    rawText: { type: String, required: true },
    parsedData: {
      name: String,
      email: String,
      phone: String,
      skills: [String],
      experienceYears: Number,
      education: String,
      summary: String,
      jobTitles: [String],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Resume", ResumeSchema);
