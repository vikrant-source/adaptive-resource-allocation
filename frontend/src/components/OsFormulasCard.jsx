import React from "react";
import { Calculator } from "lucide-react";

const formulas = [
  { label: "Response Time", detail: "First CPU Allocation – Arrival Time", example: "Example: 3 - 0 = 3" },
  { label: "CPU Utilization", detail: "(Busy Time / Total Time) × 100", example: "Example: 80/100 = 80%" },
  { label: "Throughput", detail: "Processes finished / Total Time", example: "Example: 5 / 20s = 0.25 p/s" },
  { label: "Turnaround Time", detail: "Completion Time – Arrival Time", example: "Example: 17 - 0 = 17" },
  { label: "Waiting Time", detail: "Turnaround Time – Burst Time", example: "Example: 17 - 8 = 9" },
];

function OsFormulasCard() {
  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-500">
          <Calculator size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Formulas</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Important OS Scheduling Formulas</h3>
        </div>
      </div>
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {formulas.map((f) => (
          <li key={f.label} className="glass p-3 rounded-2xl">
            <div className="font-semibold">{f.label}</div>
            <div className="text-xs text-slate-500" title={f.detail}>
              {f.detail}
            </div>
            <div className="text-xs text-emerald-500 mt-1">{f.example}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OsFormulasCard;

