import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer } from "lucide-react";

const colors = ["bg-blue-500/70", "bg-emerald-500/70", "bg-amber-500/70", "bg-purple-500/70", "bg-rose-500/70", "bg-indigo-500/70", "bg-cyan-500/70"];

function GanttChart({ history = [], timeline = [] }) {
  const ganttData = useMemo(() => {
    if (timeline && timeline.length > 0) {
      return timeline.map((slice) => ({
        process: slice.process || `P${slice.pid || 0}`,
        start: slice.start_time || 0,
        end: slice.end_time || slice.start_time || 0,
        pid: slice.pid,
      }));
    }
    
    if (history && history.length > 0) {
      let currentTime = 0;
      return history
        .filter((h) => h.active_process)
        .slice(-20)
        .map((h, idx) => {
          const start = currentTime;
          const duration = 1;
          currentTime += duration;
          return {
            process: h.active_process || `P${h.active_pid || 0}`,
            start,
            end: currentTime,
            pid: h.active_pid,
          };
        });
    }
    
    return [];
  }, [timeline, history]);

  const total = useMemo(() => {
    if (ganttData.length === 0) return 20;
    return Math.max(...ganttData.map((d) => d.end), 20);
  }, [ganttData]);

  const processColors = useMemo(() => {
    const pidMap = {};
    let colorIdx = 0;
    ganttData.forEach((d) => {
      if (d.pid && !pidMap[d.pid]) {
        pidMap[d.pid] = colors[colorIdx % colors.length];
        colorIdx++;
      }
    });
    return pidMap;
  }, [ganttData]);

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-500">
          <Timer size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Timeline</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">CPU Scheduling Gantt Chart</h3>
        </div>
      </div>
      <div className="relative w-full h-32 glass p-3 overflow-x-auto">
        {ganttData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm">
            No timeline data available
          </div>
        ) : (
          <>
            <div className="relative min-w-full" style={{ width: `${Math.max(total * 10, 100)}px` }}>
              <AnimatePresence>
                {ganttData.map((block, idx) => {
                  const left = (block.start / total) * 100;
                  const width = ((block.end - block.start) / total) * 100;
                  const color = block.pid ? processColors[block.pid] || colors[idx % colors.length] : colors[idx % colors.length];
                  return (
                    <motion.div
                      key={`${block.process}-${block.start}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.02 }}
                      className={`absolute top-3 h-12 rounded-xl ${color} text-white text-xs font-semibold flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20`}
                      style={{
                        left: `${left}%`,
                        width: `${Math.max(width, 2)}%`,
                        minWidth: "40px",
                      }}
                      title={`${block.process}: ${block.start.toFixed(1)}s → ${block.end.toFixed(1)}s`}
                    >
                      {block.process}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div className="absolute bottom-2 left-0 right-0 flex justify-between text-[10px] text-slate-500 dark:text-slate-400 px-1">
                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                  <span key={t}>{Math.round(total * t)}s</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {ganttData.length > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Real-time CPU scheduling timeline. Colored blocks show which process held the CPU over time.
        </p>
      )}
    </div>
  );
}

export default GanttChart;

