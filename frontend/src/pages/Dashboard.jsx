import React from "react";
import CpuChart from "../charts/CpuChart.jsx";
import MemoryChart from "../charts/MemoryChart.jsx";
import TimelineChart from "../charts/TimelineChart.jsx";

function Dashboard({ metrics }) {
  const history = metrics.history || [];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CpuChart history={history} />
      </div>
      <div>
        <MemoryChart history={history} />
      </div>
      <div className="lg:col-span-3">
        <TimelineChart history={history} />
      </div>
    </div>
  );
}

export default Dashboard;

