const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
  uploadResume,
  pasteResume,
  getMyResume,
} = require("../controllers/resume.controller");

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.post("/paste", protect, pasteResume);
router.get("/me", protect, getMyResume);

module.exports = router;
