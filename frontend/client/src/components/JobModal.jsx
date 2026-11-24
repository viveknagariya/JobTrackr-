import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import API from "../api/axios";

export default function JobModal({ isOpen, onClose, onSaved, editingJob }) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    salary: "",
    status: "Applied",
    followUpDate: "",
    resumeVersion: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Aaj ki local date (YYYY-MM-DD format mein) taaki past dates disable rahein
  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    if (editingJob) {
      setFormData({
        company: editingJob.company || "",
        role: editingJob.role || "",
        salary: editingJob.salary || "",
        status: editingJob.status || "Applied",
        followUpDate: editingJob.followUpDate
          ? new Date(editingJob.followUpDate).toISOString().split("T")[0]
          : "",
        resumeVersion: editingJob.resumeVersion || "",
        notes: editingJob.notes || "",
      });
    } else {
      setFormData({
        company: "",
        role: "",
        salary: "",
        status: "Applied",
        followUpDate: "",
        resumeVersion: "",
        notes: "",
      });
    }
    setError("");
  }, [editingJob, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...formData,
      followUpDate: formData.followUpDate || null,
    };

    try {
      if (editingJob) {
        await API.patch(`/jobs/${editingJob._id}`, payload);
      } else {
        await API.post("/jobs", payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="glass-card w-full max-w-lg rounded-2xl p-6 sm:p-7 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">
            {editingJob ? "Edit Application" : "Add New Application"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Company *
              </label>
              <input
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. TCS, Google"
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Role *
              </label>
              <input
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. MERN Developer"
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-slate-900"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Salary / CTC
              </label>
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 6 LPA"
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Follow-Up Date
              </label>
              <input
                type="date"
                name="followUpDate"
                min={today}
                value={formData.followUpDate}
                onChange={handleChange}
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Resume Version
              </label>
              <input
                name="resumeVersion"
                value={formData.resumeVersion}
                onChange={handleChange}
                placeholder="e.g. MERN_v2.pdf"
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="HR contact, interview questions, or referral details..."
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin text-white" />}
              {editingJob ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
