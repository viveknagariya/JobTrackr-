import { useState, useEffect, useCallback, useRef } from "react";
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
  Bell,
  Calendar,
  FileText,
  Banknote,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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

  // Notification state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasReadNotifications, setHasReadNotifications] = useState(() => {
    return localStorage.getItem("jobtrackr_notif_read") === "true";
  });
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setIsNotifOpen((prev) => !prev);
    setHasReadNotifications(true);
    localStorage.setItem("jobtrackr_notif_read", "true");
  };

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
            <span className="hidden sm:inline text-sm nav-user-greeting">
              Hi, <strong>{user?.name || "Vivek"}</strong>
            </span>

            {/* Round Black Bell Icon with Notification Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={toggleNotifications}
                className="btn-nav-bell"
                title="Follow-Up Notifications"
              >
                <Bell className="w-5 h-5 text-white" />
                {!hasReadNotifications && stats.followUpAlerts?.length > 0 && (
                  <span className="btn-nav-bell-badge">
                    {stats.followUpAlerts.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Popover */}
              {isNotifOpen && (
                <div
                  className="absolute right-0 mt-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl p-4 z-50 notif-dropdown-box"
                  style={{ border: "3px solid #7c3aed" }}
                >
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                        <Bell className="w-4 h-4" />
                      </div>
                      <h4
                        className="text-sm font-extrabold"
                        style={{ color: "#7c3aed" }}
                      >
                        Follow-Up Notifications
                      </h4>
                    </div>
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                      {stats.followUpAlerts?.length || 0} Pending
                    </span>
                  </div>

                  <div
                    className="mt-3.5 max-h-80 overflow-y-auto space-y-3 notif-scroll-container no-scrollbar"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {stats.followUpAlerts?.length > 0 ? (
                      stats.followUpAlerts.map((job) => (
                        <div
                          key={job._id}
                          className="p-3.5 rounded-2xl bg-slate-50 hover:bg-violet-50/40 transition-all cursor-pointer group notif-item-card"
                          style={{ border: "3px solid #000000" }}
                          onClick={() => {
                            openEditModal(job);
                            setIsNotifOpen(false);
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p
                                className="text-sm font-extrabold"
                                style={{ color: "#7c3aed" }}
                              >
                                {job.company}
                              </p>
                              <p className="text-xs font-bold text-slate-700 mt-0.5">
                                {job.role}
                              </p>
                            </div>
                            <span
                              className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full notif-followup-badge shrink-0"
                              style={{
                                backgroundColor: "#7c3aed",
                                color: "#000000",
                              }}
                            >
                              Follow-Up
                            </span>
                          </div>
                          {job.followUpDate && (
                            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-bold text-black">
                              <Calendar className="w-3.5 h-3.5 text-black" />
                              <span>
                                Action Date:{" "}
                                {new Date(job.followUpDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-400">
                        <p className="text-xs font-bold">
                          All caught up! No pending follow-ups.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={openAddModal}
              className="btn-nav-add-job"
            >
              <Plus className="h-4 w-4" />
              <span>Add Job</span>
            </button>
            <button
              onClick={logout}
              title="Logout"
              className="btn-nav-logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
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
                  <p className="text-xs font-extrabold uppercase tracking-wider kpi-card-label">
                    {item.label}
                  </p>
                  <p className="text-3xl font-extrabold mt-1.5 kpi-card-count">
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
          <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 app-toolbar-section">
            <div>
              <h2
                className="text-xl font-extrabold tracking-tight"
                style={{ color: "#7c3aed" }}
              >
                Applications ({totalJobs})
              </h2>
              <p
                className="text-xs font-semibold mt-1"
                style={{ color: "#7c3aed" }}
              >
                Search, filter, and track every stage of your job hunt
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Search Input: Oval Shape, Normal Border, Violet on Focus */}
              <div className="relative flex-1 sm:w-72">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                  style={{ color: "#7c3aed" }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search company or role..."
                  className="glass-input search-input-violet w-full h-11 pl-11 pr-4 text-sm font-medium shadow-xs"
                />
              </div>

              {/* Status Filter */}
              <div className="relative sm:min-w-[155px]">
                <SlidersHorizontal
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                  style={{ color: "#7c3aed" }}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="glass-input filter-select-violet w-full h-11 pl-11 pr-10 text-sm font-bold shadow-xs cursor-pointer appearance-none"
                >
                  <option value="All">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                  style={{ color: "#7c3aed" }}
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative sm:min-w-[160px]">
                <ArrowUpDown
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                  style={{ color: "#7c3aed" }}
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="glass-input filter-select-violet w-full h-11 pl-11 pr-10 text-sm font-bold shadow-xs cursor-pointer appearance-none"
                >
                  <option value="latest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="a-z">Company A–Z</option>
                  <option value="z-a">Company Z–A</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                  style={{ color: "#7c3aed" }}
                />
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
                  className="glass-card job-application-card rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className="font-extrabold text-base tracking-tight"
                          style={{ color: "#7c3aed" }}
                        >
                          {job.company}
                        </h3>
                        <p className="text-sm font-bold text-black mt-0.5">
                          {job.role}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          STATUS_STYLES[job.status] || STATUS_STYLES.Applied
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs font-bold text-black">
                      {job.salary && (
                        <div className="flex items-center gap-1.5 font-bold text-black">
                          <Banknote
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: "#7c3aed" }}
                          />
                          <span className="font-bold" style={{ color: "#7c3aed" }}>
                            CTC:
                          </span>
                          <span className="font-extrabold text-black">{job.salary}</span>
                        </div>
                      )}
                      {job.followUpDate && (
                        <div className="flex items-center gap-1.5 font-bold text-black">
                          <Calendar
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: "#7c3aed" }}
                          />
                          <span className="font-bold" style={{ color: "#7c3aed" }}>
                            Follow-up:
                          </span>
                          <span className="font-extrabold text-black">
                            {new Date(job.followUpDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {job.resumeVersion && (
                        <div className="flex items-center gap-1.5 font-bold text-black">
                          <FileText
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: "#7c3aed" }}
                          />
                          <span className="font-bold" style={{ color: "#7c3aed" }}>
                            Resume:
                          </span>
                          <span className="font-extrabold text-black truncate">
                            {job.resumeVersion}
                          </span>
                        </div>
                      )}
                      {job.notes && (
                        <div className="pt-2 border-t border-slate-200 text-xs flex items-start gap-1.5">
                          <span
                            className="font-bold shrink-0"
                            style={{ color: "#7c3aed" }}
                          >
                            Notes:
                          </span>
                          <span className="font-bold text-black line-clamp-2">
                            {job.notes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => openEditModal(job)}
                      className="btn-card-edit"
                    >
                      <Pencil className="h-3.5 w-3.5 text-white" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="btn-card-delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {numOfPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 pb-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center pagination-arrow-btn disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #7c3aed",
                }}
                title="Previous Page"
              >
                <ChevronLeft className="h-5 w-5" style={{ color: "#7c3aed" }} />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: numOfPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer shadow-xs ${
                      page === pageNum
                        ? "pagination-number-active"
                        : "pagination-number-inactive"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                disabled={page === numOfPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center pagination-arrow-btn disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #7c3aed",
                }}
                title="Next Page"
              >
                <ChevronRight className="h-5 w-5" style={{ color: "#7c3aed" }} />
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
