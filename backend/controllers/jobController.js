const Job = require("../models/Job");

// @desc    Create a new job application
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { company, role, salary, status, followUpDate, resumeVersion, notes } =
      req.body;

    if (!company || !role) {
      return res
        .status(400)
        .json({ message: "Company and Role are required" });
    }

    const job = await Job.create({
      company,
      role,
      salary,
      status,
      followUpDate,
      resumeVersion,
      notes,
      createdBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs (with Search, Filter, Sort & Pagination)
// @route   GET /api/jobs?status=Applied&search=google&page=1&limit=10
const getJobs = async (req, res) => {
  try {
    const { status, search, sort } = req.query;
    const queryObject = { createdBy: req.user._id };

    // Status filter
    if (status && status !== "All") {
      queryObject.status = status;
    }

    // Search by company or role (case-insensitive)
    if (search) {
      queryObject.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sortOption = "-createdAt"; // Default: newest first
    if (sort === "oldest") sortOption = "createdAt";
    if (sort === "a-z") sortOption = "company";
    if (sort === "z-a") sortOption = "-company";

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find(queryObject)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(200).json({
      jobs,
      totalJobs,
      numOfPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job application
// @route   PATCH /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ownership check
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job application
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ownership check
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Job Analytics & Follow-Up Alerts (MongoDB Aggregation)
// @route   GET /api/jobs/stats
const getJobStats = async (req, res) => {
  try {
    // 1. Status Breakdown Aggregation
    let stats = await Job.aggregate([
      { $match: { createdBy: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    stats = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const defaultStats = {
      Applied: stats.Applied || 0,
      Interviewing: stats.Interviewing || 0,
      Offer: stats.Offer || 0,
      Rejected: stats.Rejected || 0,
    };

    // 2. Monthly Applications Aggregation (Last 6 months)
    let monthlyApplications = await Job.aggregate([
      { $match: { createdBy: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    monthlyApplications = monthlyApplications
      .map((item) => {
        const { year, month } = item._id;
        const date = new Date(year, month - 1).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });
        return { date, count: item.count };
      })
      .reverse();

    // 3. Follow-Up Alerts (Due today/past OR Applied > 7 days ago)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const followUpAlerts = await Job.find({
      createdBy: req.user._id,
      status: { $in: ["Applied", "Interviewing"] },
      $or: [
        { followUpDate: { $lte: today, $ne: null } },
        { status: "Applied", createdAt: { $lte: sevenDaysAgo } },
      ],
    }).select("company role status followUpDate createdAt");

    res.status(200).json({
      defaultStats,
      monthlyApplications,
      followUpAlerts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobStats,
};