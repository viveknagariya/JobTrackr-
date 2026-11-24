const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobStats,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

// Saare job routes protected hain
router.use(protect);

router.route("/").post(createJob).get(getJobs);
router.get("/stats", getJobStats);
router.route("/:id").patch(updateJob).delete(deleteJob);

module.exports = router;