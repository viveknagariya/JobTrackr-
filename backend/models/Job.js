const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },
    salary: {
      type: String,
      default: "Not Disclosed",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Interviewing", "Offer", "Rejected"],
      default: "Applied",
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    resumeVersion: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);