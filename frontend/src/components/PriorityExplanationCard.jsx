import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowDown, Info } from "lucide-react";

function PriorityExplanationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">How Priority Works</h3>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-amber-500/10 border border-red-500/20 dark:border-red-500/10">
          <div className="flex items-start gap-3">
            <ArrowDown className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-50 mb-1">Lower Number = Higher Priority</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Priority 1 runs before Priority 2, which runs before Priority 3, and so on.
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 dark:border-red-500/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">1-2</div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">HIGH</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Runs first, gets CPU immediately
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">3</div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">MEDIUM</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Runs after high priority processes
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20 dark:border-slate-500/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-slate-500 flex items-center justify-center text-white text-xs font-bold">4+</div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">LOW</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Runs last, waits longer
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/10">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-700 dark:text-slate-200">
              <span className="font-semibold">Priority Aging:</span> Processes waiting too long get their priority boosted to prevent starvation. The scheduler automatically adjusts priorities to ensure fairness.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PriorityExplanationCard;

