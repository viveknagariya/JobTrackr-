import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import JobModal from "../components/JobModal";
import StatsCharts from "../components/StatsCharts";
import {
  Briefcase,
  Plus,
  LogOut,
  Search,
  BellRing,
  Calendar,
  FileText,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

const STATUS_STYLES = {
  Applied: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  Interviewing: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Offer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Rejected: "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    defaultStats: { Applied: 0, Interviewing: 0, Offer: 0, Rejected: 0 },
    monthlyApplications: [],
    followUpAlerts: [],
  });

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      const { data } = await API.get("/jobs", {
        params: { search, status: statusFilter, sort, page, limit: 6 },
      });
      setJobs(data.jobs);
      setNumOfPages(data.numOfPages || 1);
      setTotalJobs(data.totalJobs || 0);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  }, [search, statusFilter, sort, page]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get("/jobs/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleRefresh = () => {
    fetchJobs();
    fetchStats();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job application?")) return;
    try {
      await API.delete(`/jobs/${id}`);
      handleRefresh();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const openAddModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const kpiCards = [
    {
      label: "Applied",
      count: stats.defaultStats.Applied,
      icon: Send,
      color: "text-sky-400 bg-sky-500/15",
    },
    {
      label: "Interviewing",
      count: stats.defaultStats.Interviewing,
      icon: Clock,
      color: "text-amber-400 bg-amber-500/15",
    },
    {
      label: "Offers",
      count: stats.defaultStats.Offer,
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/15",
    },
    {
      label: "Rejected",
      count: stats.defaultStats.Rejected,
      icon: XCircle,
      color: "text-rose-400 bg-rose-500/15",
    },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Top Glass Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#070B14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              JobTrackr
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-sm text-slate-400">
              Hi, <strong className="text-slate-200">{user?.name}</strong>
            </span>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Job
            </button>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Standout Feature: Follow-Up Alert Banner */}
        {stats.followUpAlerts.length > 0 && (
          <div className="rounded-2xl p-4 sm:p-5 bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-300">
                  Follow-Up Action Needed ({stats.followUpAlerts.length})
                </h4>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Time to follow up with:{" "}
                  {stats.followUpAlerts
                    .map((j) => `${j.company} (${j.role})`)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="glass-card rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-3xl font-bold text-white mt-1.5">
                    {item.count}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Analytics Charts (Bar + Pie by Category) */}
        <StatsCharts defaultStats={stats.defaultStats} />

        {/* Applications List + Upgraded Search/Filter Toolbar */}
        <section className="pt-2 space-y-6">
          <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Applications ({totalJobs})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Search, filter, and track every stage of your job hunt
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search company or role..."
                  className="glass-input w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white placeholder:text-slate-500 shadow-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="relative sm:min-w-[155px]">
                <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="glass-input w-full h-11 pl-10 pr-8 rounded-xl text-sm font-medium text-white bg-slate-900 shadow-sm cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="relative sm:min-w-[160px]">
                <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="glass-input w-full h-11 pl-10 pr-8 rounded-xl text-sm font-medium text-white bg-slate-900 shadow-sm cursor-pointer"
                >
                  <option value="latest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="a-z">Company A–Z</option>
                  <option value="z-a">Company Z–A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Cards Grid */}
          {jobs.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-slate-400 text-sm">
                No applications found. Click <strong>+ Add Job</strong> to start tracking.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="glass-card rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/30 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-white text-base">
                          {job.company}
                        </h3>
                        <p className="text-sm text-slate-300 mt-0.5">
                          {job.role}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          STATUS_STYLES[job.status] || STATUS_STYLES.Applied
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-400">
                      {job.salary && (
                        <p>
                          CTC: <span className="text-slate-200">{job.salary}</span>
                        </p>
                      )}
                      {job.followUpDate && (
                        <p className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                          Follow-up:{" "}
                          <span className="text-slate-200">
                            {new Date(job.followUpDate).toLocaleDateString()}
                          </span>
                        </p>
                      )}
                      {job.resumeVersion && (
                        <p className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-sky-400" />
                          {job.resumeVersion}
                        </p>
                      )}
                      {job.notes && (
                        <p className="text-slate-400 line-clamp-2 pt-1 border-t border-white/5">
                          {job.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-white/8">
                    <button
                      onClick={() => openEditModal(job)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/15 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {numOfPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="glass-card px-3.5 py-2 rounded-xl text-sm text-slate-300 hover:text-white disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <span className="text-sm text-slate-400">
                Page <strong className="text-white">{page}</strong> of {numOfPages}
              </span>
              <button
                disabled={page === numOfPages}
                onClick={() => setPage((p) => p + 1)}
                className="glass-card px-3.5 py-2 rounded-xl text-sm text-slate-300 hover:text-white disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      </main>

      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleRefresh}
        editingJob={editingJob}
      />
    </div>
  );
}
