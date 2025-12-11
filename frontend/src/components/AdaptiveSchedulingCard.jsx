import React, { useState } from "react";
import { Cpu, Gauge, ArrowUpRight, ScrollText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const items = [
  { icon: <Gauge size={16} />, title: "Adaptive Quantum", detail: "Time slice shrinks on high CPU load and relaxes when idle." },
  { icon: <ArrowUpRight size={16} />, title: "Priority Aging", detail: "Waiting processes get priority boosts to avoid starvation." },
  { icon: <Cpu size={16} />, title: "I/O vs CPU Bound", detail: "I/O-heavy tasks get shorter bursts; CPU-heavy tasks adapt over time." },
  { icon: <ScrollText size={16} />, title: "Working Set Aware", detail: "Memory pressure influences scheduling to reduce thrashing." },
];

function AdaptiveSchedulingCard() {
  const [open, setOpen] = useState(true);

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Gauge size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Explainer</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Adaptive Scheduling</h3>
          </div>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="pill bg-white/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 border border-ios-border dark:border-slate-700"
        >
          {open ? "Collapse" : "Expand"}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 text-sm text-slate-700 dark:text-slate-200"
          >
            {items.map((item) => (
              <li key={item.title} className="glass p-3 rounded-2xl flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500">{item.icon}</span>
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</div>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdaptiveSchedulingCard;

