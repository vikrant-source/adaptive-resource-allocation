import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Zap } from "lucide-react";

const badgeCls = {
  running: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  ready: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  waiting: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  completed: "bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30",
};

const getPriorityBadge = (priority) => {
  if (priority <= 2) {
    return { label: "HIGH", color: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40", icon: <ArrowUp className="h-3 w-3" /> };
  } else if (priority <= 3) {
    return { label: "MED", color: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40", icon: <Zap className="h-3 w-3" /> };
  } else {
    return { label: "LOW", color: "bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/40", icon: <ArrowDown className="h-3 w-3" /> };
  }
};

function ProcessTable({ processes }) {
  const sortedProcesses = useMemo(() => {
    return [...processes].sort((a, b) => {
      // Sort by state first (completed last)
      const stateOrder = { running: 0, ready: 1, waiting: 2, blocked: 3, completed: 99 };
      const stateDiff = (stateOrder[a.state] || 99) - (stateOrder[b.state] || 99);
      if (stateDiff !== 0) return stateDiff;
      
      // Then by priority (lower number = higher priority)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return 0;
    });
  }, [processes]);

  const nextProcess = useMemo(() => {
    const ready = sortedProcesses.filter((p) => p.state === "ready" || p.state === "running");
    return ready.length > 0 ? ready[0] : null;
  }, [sortedProcesses]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Processes</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Process Table 📄</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Processes sorted by priority (lower number = higher priority). Higher priority processes run first.
          </p>
        </div>
        <span className="pill bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-100">
          {processes.length} processes
        </span>
      </div>

      {nextProcess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 dark:border-emerald-500/20"
        >
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-emerald-500" />
            <span className="text-slate-700 dark:text-slate-200 font-medium">
              Next to run: <span className="font-bold text-emerald-600 dark:text-emerald-400">{nextProcess.name}</span> (Priority: {nextProcess.priority})
            </span>
          </div>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500 dark:text-slate-400">
            <tr>
              <th className="pb-2" title="Process identifier">PID</th>
              <th className="pb-2" title="Human-friendly label">Name</th>
              <th className="pb-2" title="Lower number = higher priority (runs first)">
                Priority ⚡
              </th>
              <th className="pb-2" title="Remaining burst estimate">CPU</th>
              <th className="pb-2" title="Working set size">Memory</th>
              <th className="pb-2" title="Running/ready/waiting">State</th>
            </tr>
          </thead>
          <tbody className="text-slate-800 dark:text-slate-100">
            {sortedProcesses.map((p, idx) => {
              const priorityBadge = getPriorityBadge(p.priority);
              const isNext = nextProcess && p.pid === nextProcess.pid;
              const isCompleted = p.state === "completed";
              const fadeOut = isCompleted && p._completedTime && Date.now() - p._completedTime > 3000;
              
              return (
                <motion.tr
                  key={p.pid}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: fadeOut ? 0.3 : 1, 
                    x: 0 
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-t border-slate-200/60 dark:border-slate-800/80 ${
                    isNext ? "bg-emerald-500/5 dark:bg-emerald-500/10" : ""
                  } ${isCompleted ? "bg-slate-100/30 dark:bg-slate-800/20" : ""}`}
                >
                  <td className="py-2 text-slate-500 dark:text-slate-400">{p.pid}</td>
                  <td className="py-2 font-semibold">
                    {p.name}
                    {isNext && <span className="ml-2 text-xs text-emerald-500">⏭️ Next</span>}
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-50">{p.priority}</span>
                      <span className={`pill border text-xs flex items-center gap-1 ${priorityBadge.color}`}>
                        {priorityBadge.icon}
                        {priorityBadge.label}
                      </span>
                    </div>
                  </td>
                  <td className="py-2">
                    {p.state === "completed" ? (
                      "0.0"
                    ) : (
                      <>
                        {p.cpu_burst?.toFixed?.(1) || "0.0"}%
                        {p.cpu_burst > 0 && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">
                            (~{Math.ceil(p.cpu_burst / 0.08)}s)
                          </span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="py-2">{p.memory_mb} MB</td>
                  <td className="py-2">
                    <span className={`pill border ${badgeCls[p.state] || badgeCls.ready}`}>
                      {p.state === "completed" ? "COMPLETED" : p.state.toUpperCase()}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
            {!processes.length && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-slate-500 dark:text-slate-400">
                  No processes yet. Start the simulation or add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProcessTable;

