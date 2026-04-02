const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} = require("../controllers/application.controller");

const router = express.Router();

router.get("/", protect, getApplications);
router.post("/", protect, createApplication);
router.put("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);

module.exports = router;
