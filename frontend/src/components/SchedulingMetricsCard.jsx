import React from "react";
import { motion } from "framer-motion";
import { Info, Cpu, BarChart } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const rows = [
  { p: "P1", at: 0, bt: 8, ct: 17, tat: 17, wt: 9 },
  { p: "P2", at: 1, bt: 4, ct: 5, tat: 4, wt: 0 },
  { p: "P3", at: 2, bt: 9, ct: 26, tat: 24, wt: 15 },
  { p: "P4", at: 3, bt: 5, ct: 10, tat: 7, wt: 2 },
];

const states = [
  { label: "Ready", icon: <BarChart size={14} />, tip: "Waiting to be scheduled on CPU." },
  { label: "Running", icon: <Cpu size={14} />, tip: "Currently executing on CPU." },
  { label: "Waiting", icon: <Info size={14} />, tip: "Temporarily paused (e.g., for I/O)." },
  { label: "Blocked", icon: <Info size={14} />, tip: "Cannot proceed until event/resource is available." },
  { label: "Completed", icon: <Info size={14} />, tip: "Finished execution." },
];

function SchedulingMetricsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card space-y-4"
    >
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-500">
          <Info size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">📊 Scheduling Metrics — Quick Explanation</p>
        </div>
      </div>

      <div className="space-y-3 text-sm text-slate-800 dark:text-slate-100">
        <div>
          <div className="font-semibold">Completion Time (CT)</div>
          <div className="text-slate-500 dark:text-slate-400">The time at which a process finishes execution.</div>
        </div>
        <div>
          <div className="font-semibold">Turnaround Time (TAT)</div>
          <div className="text-slate-500 dark:text-slate-400">TAT = CT – Arrival Time</div>
          <div className="text-slate-500 dark:text-slate-400">Represents the total time a process spends in the system.</div>
        </div>
        <div>
          <div className="font-semibold">Waiting Time (WT)</div>
          <div className="text-slate-500 dark:text-slate-400">WT = TAT – Burst Time</div>
          <div className="text-slate-500 dark:text-slate-400">Represents how long a process waited in the ready queue.</div>
        </div>
      </div>

      <div>
        <div className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Example Table</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500 dark:text-slate-400">
              <tr>
                {["Process", "AT", "BT", "CT", "TAT", "WT"].map((h) => (
                  <th key={h} className="pb-2 pr-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-800 dark:text-slate-100">
              {rows.map((r) => (
                <tr key={r.p} className="border-t border-slate-200/60 dark:border-slate-800/80">
                  <td className="py-2 pr-3 font-semibold">{r.p}</td>
                  <td className="py-2 pr-3">{r.at}</td>
                  <td className="py-2 pr-3">{r.bt}</td>
                  <td className="py-2 pr-3">{r.ct}</td>
                  <td className="py-2 pr-3">{r.tat}</td>
                  <td className="py-2 pr-3">{r.wt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-2">Average TAT: 13</div>
      </div>

      <div className="space-y-2">
        <div className="font-semibold text-slate-900 dark:text-slate-50">Process States:</div>
        <div className="flex flex-wrap gap-2">
          {states.map((s) => (
            <div
              key={s.label}
              data-tooltip-id={`state-${s.label}`}
              data-tooltip-content={s.tip}
              className="pill bg-white/70 dark:bg-slate-800/70 border border-ios-border dark:border-slate-700 text-slate-800 dark:text-slate-100"
            >
              {s.icon}
              <span>{s.label}</span>
              <Tooltip id={`state-${s.label}`} className="!rounded-xl !px-3 !py-2" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default SchedulingMetricsCard;

