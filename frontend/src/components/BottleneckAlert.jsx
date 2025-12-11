import React from "react";
import { motion } from "framer-motion";

const palette = {
  critical: "from-rose-500/90 to-orange-400/90",
  warning: "from-amber-400/80 to-yellow-500/80",
  info: "from-sky-400/80 to-blue-500/80",
};

function BottleneckAlert({ alerts }) {
  const items = alerts?.length ? alerts : [{ type: "ok", level: "info", detail: "System stable" }];
  return (
    <div className="card space-y-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Health</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Bottleneck Alerts ⚠️</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Warns when CPU overloaded, memory thrashing, or page fault spikes occur.
        </p>
      </div>
      <div className="space-y-2">
        {items.map((alert, idx) => (
          <motion.div
            key={`${alert.type}-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl bg-gradient-to-r ${
              palette[alert.level] || palette.info
            } text-white px-4 py-3 shadow-glow`}
          >
            <div className="text-xs uppercase tracking-wide opacity-80">{alert.type}</div>
            <div className="font-semibold">{alert.detail}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default BottleneckAlert;

