import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const fmt = (n) => `${Math.round(n)} MB`;

function MemoryChart({ history }) {
  const data = history?.map((d) => ({
    ...d,
    usage: d.memory_used,
    label: new Date(d.timestamp * 1000).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
  }));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Memory</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Memory Allocation 💾</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Shows working set size, memory pressure, and page fault behavior.
          </p>
        </div>
        <span
          className="pill bg-emerald-500/10 text-emerald-600 dark:text-emerald-200"
          title="Working Set Size: memory actively used by running processes."
        >
          Area
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <XAxis dataKey="label" hide />
            <YAxis tickFormatter={fmt} tick={{ fill: "#94a3b8" }} />
            <Tooltip
              formatter={(value) => fmt(value)}
              contentStyle={{ borderRadius: 16, backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <Area type="monotone" dataKey="usage" stroke="#34d399" fill="#34d399" fillOpacity={0.25} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MemoryChart;

