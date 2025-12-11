import React from "react";

function SchedulingNoteCard() {
  const block = `
Process   Arrival   Burst   CT    Turnaround Time        Waiting Time
P1        0        8       17     17 - 0 = 17            17 - 8 = 9
P2        1        4        5      5 - 1 = 4              4 - 4 = 0
P3        2        9       26     26 - 2 = 24            24 - 9 = 15
P4        3        5       10     10 - 3 = 7              7 - 5 = 2
`;

  return (
    <div className="card space-y-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Notes</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Scheduling Calculations (classroom style)</h3>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-sm bg-white/50 dark:bg-slate-900/40 p-3 rounded-2xl border border-ios-border dark:border-slate-800 shadow-inner">
        {block}
      </pre>
      <div className="text-sm text-slate-700 dark:text-slate-200 space-y-1">
        <div>Turnaround Time = Completion Time – Arrival Time</div>
        <div>Waiting Time = Turnaround Time – Burst Time</div>
      </div>
    </div>
  );
}

export default SchedulingNoteCard;

