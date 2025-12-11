import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function TimelineChart({ history }) {
  const data =
    history?.map((d) => ({
      ...d,
      label: new Date(d.timestamp * 1000).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
      faults: d.page_faults,
      quantum: d.quantum_ms,
    })) || [];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Timeline</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Timeline 🕒</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Shows CPU slices and page faults to explain Round Robin + adaptive quantum.
          </p>
        </div>
        <span className="pill bg-purple-500/10 text-purple-600 dark:text-purple-200">Bars</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="label" hide />
            <YAxis yAxisId="left" orientation="left" stroke="#a855f7" />
            <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" />
            <Tooltip
              contentStyle={{ borderRadius: 16, backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <Bar yAxisId="left" dataKey="quantum" name="Quantum (ms)" fill="#a855f7" radius={[10, 10, 4, 4]} />
            <Bar yAxisId="right" dataKey="faults" name="Page Faults" fill="#38bdf8" radius={[10, 10, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TimelineChart;

