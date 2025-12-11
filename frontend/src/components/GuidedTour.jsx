import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const steps = [
  { title: "CPU Usage", body: "See how busy the CPU is and how quantum adapts." },
  { title: "Memory", body: "Working set size and pressure with page fault hints." },
  { title: "Process Table", body: "Track PID, priority, and states driving scheduling." },
  { title: "Timeline", body: "Visualize CPU slices and paging over time." },
];

function GuidedTour({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass max-w-xl w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Guided Tour</p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Quick walkthrough</h3>
              </div>
              <button onClick={onClose} className="pill bg-slate-200/70 dark:bg-slate-800/70">
                Close
              </button>
            </div>
            <div className="space-y-3">
              {steps.map((s, idx) => (
                <div key={s.title} className="rounded-2xl border border-ios-border dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Step {idx + 1}</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-50">{s.title}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-200">{s.body}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GuidedTour;

