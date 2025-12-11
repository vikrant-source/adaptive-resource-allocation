import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const formatTime = (ts) => new Date(ts * 1000).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });

function CpuChart({ history }) {
  const data = history?.map((d) => ({ ...d, label: formatTime(d.timestamp) })) || [];
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">CPU</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">CPU Utilization 🧠</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Shows how busy the CPU is. Higher % = more workload. Updates every 2s.
          </p>
        </div>
        <span
          className="pill bg-blue-500/10 text-blue-600 dark:text-blue-200"
          title="CPU Usage: Percentage of time CPU executes processes."
        >
          Line
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="label" hide />
            <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{ borderRadius: 16, backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" }}
              labelFormatter={(v) => v}
            />
            <Line type="monotone" dataKey="cpu" stroke="#38bdf8" strokeWidth={3} dot={false} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CpuChart;

