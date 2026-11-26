import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

export default function StatsCharts({ defaultStats }) {
  const chartData = [
    { name: "Applied", count: defaultStats?.Applied || 0, color: "#2563eb" },
    { name: "Interviewing", count: defaultStats?.Interviewing || 0, color: "#f97316" },
    { name: "Offer", count: defaultStats?.Offer || 0, color: "#16a34a" },
    { name: "Rejected", count: defaultStats?.Rejected || 0, color: "#7c3aed" },
  ];

  const total = chartData.reduce((sum, item) => sum + item.count, 0);
  const pieData = chartData.filter((item) => item.count > 0);

  if (total === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-sm text-slate-400">
        Add your first few applications to see the category breakdown charts.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart: Category-wise Count */}
      <div className="glass-card rounded-2xl p-6 chart-card-violet">
        <div className="mb-5">
          <h3
            className="text-base font-bold tracking-tight chart-title-violet"
            style={{ color: "#7c3aed" }}
          >
            Category Breakdown (Bar Chart)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Total applications across each stage
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.08)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  color: "#0f172a",
                  fontSize: "13px",
                  boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                }}
              />
              <Bar dataKey="count" name="Applications" radius={[8, 8, 0, 0]} maxBarSize={55}>
                {chartData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie / Donut Chart: Percentage Distribution */}
      <div className="glass-card rounded-2xl p-6 chart-card-violet">
        <div className="mb-5">
          <h3
            className="text-base font-bold tracking-tight chart-title-violet"
            style={{ color: "#7c3aed" }}
          >
            Status Distribution (Pie Chart)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Share of each category in your job pipeline
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`pie-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  color: "#0f172a",
                  fontSize: "13px",
                  boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}