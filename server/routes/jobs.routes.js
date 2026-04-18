const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const {
  findMatches,
  saveJob,
  getSavedJobs,
  getLatestMatches,
} = require("../controllers/jobs.controller");

const router = express.Router();

router.post("/match", protect, findMatches);
router.get("/latest", protect, getLatestMatches);
router.post("/save/:jobId", protect, saveJob);
router.get("/saved", protect, getSavedJobs);

module.exports = router;
