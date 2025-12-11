import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

function ThemeToggle({ theme, onToggle }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={onToggle}
      className="relative h-10 w-20 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border border-ios-border dark:border-slate-600 shadow-lg overflow-hidden"
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute inset-y-1 left-1 w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center"
        animate={{
          x: theme === "dark" ? 40 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {theme === "light" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-4 w-4 text-amber-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-4 w-4 text-indigo-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-around px-2">
        <Sun className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400/30" />
        <Moon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
      </div>
    </motion.button>
  );
}

export default ThemeToggle;

