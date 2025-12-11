import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

function ProcessLifecycleRings({ processes = [] }) {
  const processRings = useMemo(() => {
    return processes.slice(0, 6).map((p) => {
      const burstTotal = p.cpu_burst || 1;
      const burstDone = Math.max(0, burstTotal - (p.remaining_burst || burstTotal));
      const cpuProgress = Math.min((burstDone / burstTotal) * 100, 100);

      const memoryTotal = p.memory_mb || 100;
      const memoryUsed = p.working_set_mb || 0;
      const memoryProgress = Math.min((memoryUsed / memoryTotal) * 100, 100);

      const ioWait = p.io_wait_cycles || 0;
      const ioMax = 10;
      const ioProgress = Math.min((ioWait / ioMax) * 100, 100);

      return {
        pid: p.pid,
        name: p.name || `P${p.pid}`,
        cpuProgress,
        memoryProgress,
        ioProgress,
        state: p.state || "ready",
      };
    });
  }, [processes]);

  const Ring = ({ radius, progress, color, strokeWidth = 4 }) => {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-500"
      />
    );
  };

  if (processRings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card text-center py-8 text-slate-500 dark:text-slate-400"
      >
        <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No processes running</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Process Lifecycle</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
        {processRings.map((proc) => (
          <motion.div
            key={proc.pid}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 border border-ios-border dark:border-slate-700 backdrop-blur-sm"
          >
            <div className="relative mb-3">
              <svg width="100" height="100" className="transform -rotate-90">
                {/* Background circles */}
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
                <circle cx="50" cy="50" r="21" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
                {/* Progress rings */}
                <Ring radius={35} progress={proc.ioProgress} color="#a855f7" strokeWidth={3} />
                <Ring radius={28} progress={proc.memoryProgress} color="#f97316" strokeWidth={3} />
                <Ring radius={21} progress={proc.cpuProgress} color="#3b82f6" strokeWidth={3} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-50">{proc.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{proc.state}</div>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-xs w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">CPU</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-50">{Math.round(proc.cpuProgress)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Memory</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-50">{Math.round(proc.memoryProgress)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">I/O</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-50">{Math.round(proc.ioProgress)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ProcessLifecycleRings;

