const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: String,
    jobTitle: String,
    company: String,
    location: String,
    applyLink: String,
    status: {
      type: String,
      enum: ["saved", "applied", "interview", "offer", "rejected"],
      default: "saved",
    },
    notes: String,
    appliedAt: Date,
    interviewDate: Date,
    salary: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", ApplicationSchema);
