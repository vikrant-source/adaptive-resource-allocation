import React from "react";
import { ArrowRight, Pause, Play, CheckCircle } from "lucide-react";

const stages = [
  { label: "Processes", desc: "Newly arrived tasks", color: "bg-blue-500/15 text-blue-500" },
  { label: "Ready Queue", desc: "Waiting for CPU", color: "bg-indigo-500/15 text-indigo-500" },
  { label: "CPU (Running)", desc: "Actively executing", color: "bg-emerald-500/15 text-emerald-500" },
  { label: "Waiting (I/O)", desc: "Blocked for I/O", color: "bg-amber-500/15 text-amber-500" },
  { label: "Finished", desc: "Completed work", color: "bg-slate-500/15 text-slate-500" },
];

function CpuSchedulingDiagram() {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2">
        <Play size={18} className="text-emerald-500" />
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Visual</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">How CPU Scheduling Works</h3>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {stages.map((s, idx) => (
          <React.Fragment key={s.label}>
            <div className={`px-4 py-3 rounded-2xl ${s.color} glass`}>
              <div className="font-semibold">{s.label}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300">{s.desc}</div>
            </div>
            {idx < stages.length - 1 && <ArrowRight className="text-slate-400" />}
          </React.Fragment>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-200">
        <div className="glass p-3">
          <div className="flex items-center gap-2 font-semibold">
            <Play size={14} className="text-emerald-500" /> Ready Queue
          </div>
          <p className="text-xs text-slate-500 mt-1">Processes lined up for CPU time.</p>
        </div>
        <div className="glass p-3">
          <div className="flex items-center gap-2 font-semibold">
            <Pause size={14} className="text-amber-500" /> I/O Wait
          </div>
          <p className="text-xs text-slate-500 mt-1">Processes blocked while waiting on I/O.</p>
        </div>
        <div className="glass p-3">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle size={14} className="text-blue-500" /> Completion
          </div>
          <p className="text-xs text-slate-500 mt-1">Process finishes and exits the system.</p>
        </div>
        <div className="glass p-3">
          <div className="flex items-center gap-2 font-semibold">
            <ArrowRight size={14} className="text-purple-500" /> Running
          </div>
          <p className="text-xs text-slate-500 mt-1">CPU executes current time slice.</p>
        </div>
      </div>
    </div>
  );
}

export default CpuSchedulingDiagram;

