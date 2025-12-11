import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

function CpuRing({ cpuUsage = 0 }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(cpuUsage);
    }, 100);
    return () => clearTimeout(timer);
  }, [cpuUsage]);

  const getColor = () => {
    if (cpuUsage < 40) return "#10b981"; // green
    if (cpuUsage < 70) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const offset = circumference - (animatedValue / 100) * circumference;
  const color = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="card flex flex-col items-center justify-center p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">CPU Usage</h3>
      </div>

      <div className="relative">
        <svg width="140" height="140" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              filter: cpuUsage > 80 ? `drop-shadow(0 0 8px ${color})` : "none",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={cpuUsage}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold"
            style={{ color }}
          >
            {Math.round(cpuUsage)}%
          </motion.div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">CPU</div>
        </div>
      </div>

      {cpuUsage > 80 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-4 text-xs text-red-500 dark:text-red-400 font-medium"
        >
          High CPU Load
        </motion.div>
      )}
    </motion.div>
  );
}

export default CpuRing;

