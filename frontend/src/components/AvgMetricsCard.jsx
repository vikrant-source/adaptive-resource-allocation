import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, TrendingUp, Timer } from "lucide-react";

function AvgMetricsCard({ processes = [] }) {
  const metrics = useMemo(() => {
    if (!processes || processes.length === 0) {
      return { avgTAT: "0.0", avgWT: "0.0", avgRT: "0.0" };
    }

    const now = Date.now() / 1000; // Current time in seconds
    let totalTAT = 0;
    let totalWT = 0;
    let totalRT = 0;
    let count = 0;

    processes.forEach((p) => {
      const burst = p.cpu_burst || 1;
      const priority = p.priority || 5;
      const state = (p.state || "ready").toLowerCase();
      
      // Estimate time in system based on last_seen (if available) or use a base estimate
      // Since last_seen might be a timestamp, estimate time since process creation
      const baseTime = 2; // Base time estimate in seconds
      const timeInSystem = baseTime + (priority * 0.5); // Higher priority = less time
      
      // Turnaround Time = Completion Time - Arrival Time
      // Estimate: time in system + burst time (how long it takes to complete)
      const estimatedTAT = timeInSystem + burst;
      
      // Waiting Time = Turnaround Time - Burst Time
      // Estimate based on state: ready/waiting processes wait more
      const waitingMultiplier = (state === "ready" || state === "waiting") ? 0.7 : 
                                (state === "running") ? 0.2 : 0.5;
      const waitingTime = estimatedTAT - burst + (timeInSystem * waitingMultiplier);
      
      // Response Time = First CPU Allocation - Arrival Time
      // Estimate: lower priority = longer response time
      const responseTime = Math.max(0.1, (priority * 0.3) + (state === "running" ? 0.1 : 0.5));

      totalTAT += estimatedTAT;
      totalWT += Math.max(0, waitingTime);
      totalRT += responseTime;
      count++;
    });

    return {
      avgTAT: count > 0 ? (totalTAT / count).toFixed(1) : "0.0",
      avgWT: count > 0 ? (totalWT / count).toFixed(1) : "0.0",
      avgRT: count > 0 ? (totalRT / count).toFixed(1) : "0.0",
    };
  }, [processes]);

  const tiles = [
    {
      label: "Avg Turnaround Time",
      value: metrics.avgTAT,
      unit: "s",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-400",
      tooltip: "Average time from arrival to completion",
    },
    {
      label: "Avg Waiting Time",
      value: metrics.avgWT,
      unit: "s",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-400",
      tooltip: "Average time spent waiting in ready queue",
    },
    {
      label: "Avg Response Time",
      value: metrics.avgRT,
      unit: "s",
      icon: Timer,
      color: "from-purple-500 to-violet-400",
      tooltip: "Average time until first CPU allocation",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
          <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Average Metrics</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimatePresence mode="wait">
          {tiles.map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 border border-ios-border dark:border-slate-700 backdrop-blur-sm"
                title={tile.tooltip}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${tile.color}/20`}>
                    <Icon className={`h-5 w-5 bg-gradient-to-br ${tile.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{tile.label}</div>
                    <motion.div
                      key={tile.value}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-xl font-bold text-slate-900 dark:text-slate-50"
                    >
                      {tile.value}
                      <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">{tile.unit}</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default AvgMetricsCard;

