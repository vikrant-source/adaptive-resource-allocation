import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Cpu, Timer, AlertTriangle, CheckCircle } from "lucide-react";

const states = [
  { key: "ready", label: "Ready", icon: Clock, color: "from-blue-500 to-cyan-400" },
  { key: "running", label: "Running", icon: Cpu, color: "from-emerald-500 to-teal-400" },
  { key: "waiting", label: "Waiting", icon: Timer, color: "from-amber-500 to-orange-400" },
  { key: "blocked", label: "Blocked", icon: AlertTriangle, color: "from-red-500 to-rose-400" },
  { key: "completed", label: "Completed", icon: CheckCircle, color: "from-slate-500 to-slate-400" },
];

function ProcessStateVisualizer({ processes = [] }) {
  const stateCounts = useMemo(() => {
    const counts = { ready: 0, running: 0, waiting: 0, blocked: 0, completed: 0 };
    processes.forEach((p) => {
      const state = (p.state || "ready").toLowerCase();
      if (counts.hasOwnProperty(state)) {
        counts[state]++;
      }
    });
    return counts;
  }, [processes]);

  const activeState = useMemo(() => {
    if (stateCounts.running > 0) return "running";
    if (stateCounts.waiting > 0) return "waiting";
    if (stateCounts.blocked > 0) return "blocked";
    if (stateCounts.ready > 0) return "ready";
    if (stateCounts.completed > 0) return "completed";
    return "ready";
  }, [stateCounts]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
          <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Process States</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <AnimatePresence mode="wait">
          {states.map((state) => {
            const Icon = state.icon;
            const count = stateCounts[state.key];
            const isActive = activeState === state.key;

            return (
              <motion.div
                key={state.key}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className={`relative p-4 rounded-2xl bg-gradient-to-br ${state.color}/10 border-2 ${
                  isActive ? "border-opacity-60 shadow-lg shadow-purple-500/20" : "border-opacity-20"
                } border-ios-border dark:border-slate-700 backdrop-blur-sm`}
                title={`${state.label}: ${count} process${count !== 1 ? "es" : ""}`}
              >
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${state.color}/20`}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(139, 92, 246, 0.4)",
                        "0 0 0 8px rgba(139, 92, 246, 0)",
                        "0 0 0 0 rgba(139, 92, 246, 0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <div className="relative flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${state.color}/20`}>
                    <Icon className={`h-5 w-5 text-slate-700 dark:text-slate-200`} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{state.label}</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-50">{count}</div>
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

export default ProcessStateVisualizer;

