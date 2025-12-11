import React from "react";

function MetricPill({ label, value, accent, icon }) {
  return (
    <div className="glass px-5 py-4 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-lg`}>
        {icon || "•"}
      </div>
    </div>
  );
}

export default MetricPill;

