import React from "react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle.jsx";

function TopBar({ theme, onToggleTheme, running }) {
  return (
    <div className="flex items-center justify-between card">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Adaptive Scheduler</p>
        <h1 className="text-2xl font-semibold mt-1 text-slate-900 dark:text-slate-50">Resource Allocation Lab</h1>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`pill ${
            running ? "bg-emerald-500/90 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${running ? "bg-lime-200" : "bg-slate-400"}`} />
          {running ? "Running" : "Idle"}
        </span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}

export default TopBar;

