import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function HowItWorks() {
  const [open, setOpen] = useState(false);
  const bullets = [
    "Every 1s the simulator updates CPU allocation.",
    "Adaptive quantum favors I/O-bound processes when load rises.",
    "Priority aging prevents starvation for long-waiting tasks.",
    "Working set grows/shrinks based on recent memory usage.",
    "Bottlenecks are detected automatically from metrics.",
  ];

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Explainer</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">How the Scheduler Works</h3>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="pill bg-white/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 border border-ios-border dark:border-slate-700"
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 text-sm text-slate-700 dark:text-slate-200"
          >
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>{b}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HowItWorks;

