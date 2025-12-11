import React from "react";
import { motion } from "framer-motion";

const btnBase =
  "flex-1 text-center rounded-2xl px-4 py-3 font-semibold transition border border-ios-border dark:border-slate-700";

function ControlPanel({ running, loading, onStart, onStop, onQuickAdd }) {
  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Controls</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Simulation</h3>
        </div>
        <span className="pill bg-blue-100/60 text-blue-700 dark:bg-blue-900/40 dark:text-blue-100">Live</span>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={running || loading}
          onClick={onStart}
          className={`${btnBase} bg-emerald-500 text-white shadow-glow disabled:opacity-60`}
        >
          ▶️ Start
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!running || loading}
          onClick={onStop}
          className={`${btnBase} bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100`}
        >
          ⏹ Stop
        </motion.button>
      </div>

      <div className="pt-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Apply workload</p>
        <div className="flex gap-2">
          {["light", "medium", "heavy"].map((preset) => (
            <motion.button
              key={preset}
              whileTap={{ scale: 0.97 }}
              onClick={() => onQuickAdd(preset)}
              className="flex-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-ios-border dark:border-slate-700 px-3 py-2 text-sm font-medium capitalize shadow-glass"
            >
              {preset}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;

