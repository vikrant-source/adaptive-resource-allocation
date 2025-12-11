import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { HardDrive } from "lucide-react";

function MemoryHeatmap({ memoryPressure = 0, pageFaults = 0 }) {
  const gridSize = 10;
  const totalCells = gridSize * gridSize;

  const cells = useMemo(() => {
    const pressureNormalized = Math.min(memoryPressure, 100);
    const faultNormalized = Math.min(pageFaults / 2, 50);
    const activeCells = Math.floor((pressureNormalized / 100) * totalCells);

    return Array.from({ length: totalCells }, (_, i) => {
      const intensity = i < activeCells ? (activeCells - i) / activeCells : 0;
      const faultBoost = i < activeCells && faultNormalized > 0 ? faultNormalized / 100 : 0;
      const finalIntensity = Math.min(intensity + faultBoost, 1);

      let color = "bg-slate-200 dark:bg-slate-800";
      if (finalIntensity > 0.7) {
        color = "bg-red-500";
      } else if (finalIntensity > 0.4) {
        color = "bg-amber-500";
      } else if (finalIntensity > 0.1) {
        color = "bg-blue-500";
      }

      return {
        intensity: finalIntensity,
        color,
        value: Math.round(finalIntensity * 100),
      };
    });
  }, [memoryPressure, pageFaults]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-4">
        <HardDrive className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Memory Pressure</h3>
        <div className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          {Math.round(memoryPressure)}% | {pageFaults} faults
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
        {cells.map((cell, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.001, duration: 0.2 }}
            className={`aspect-square rounded ${cell.color} transition-all duration-300`}
            style={{
              opacity: cell.intensity > 0 ? 0.6 + cell.intensity * 0.4 : 0.2,
            }}
            title={`Pressure: ${cell.value}%`}
            whileHover={{ scale: 1.2, zIndex: 10 }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-slate-500 dark:text-slate-400">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span className="text-slate-500 dark:text-slate-400">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-slate-500 dark:text-slate-400">High</span>
        </div>
      </div>
    </motion.div>
  );
}

export default MemoryHeatmap;

