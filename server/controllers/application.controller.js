const Application = require("../models/Application");

const getApplications = async (req, res) => {
  const applications = await Application.find({ userId: req.user._id }).sort({
    updatedAt: -1,
  });
  return res.json({ success: true, applications });
};

const createApplication = async (req, res) => {
  const app = await Application.create({ ...req.body, userId: req.user._id });
  return res.status(201).json({ success: true, application: app });
};

const updateApplication = async (req, res) => {
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true },
  );

  if (!app)
    return res
      .status(404)
      .json({ success: false, message: "Application not found" });
  return res.json({ success: true, application: app });
};

const deleteApplication = async (req, res) => {
  await Application.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  return res.json({ success: true, message: "Application deleted" });
};

module.exports = {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
};
