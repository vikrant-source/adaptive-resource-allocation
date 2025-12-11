import React, { useState } from "react";
import { motion } from "framer-motion";

const fieldCls =
  "w-full rounded-2xl border border-ios-border dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60";

function ProcessForm({ onSubmit, loading }) {
  const [name, setName] = useState("");
  const [workload, setWorkload] = useState("medium");
  const [priority, setPriority] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, workload, priority: Number(priority) });
    setName("");
  };

  return (
    <form className="card space-y-4" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Create</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Add Process</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Analytics worker" className={fieldCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-700 dark:text-slate-200">Workload</label>
            <select value={workload} onChange={(e) => setWorkload(e.target.value)} className={fieldCls}>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-700 dark:text-slate-200">Priority (1-5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={fieldCls}
            />
          </div>
        </div>
      </div>
      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 shadow-glow disabled:opacity-60"
      >
        Add Process
      </motion.button>
    </form>
  );
}

export default ProcessForm;

