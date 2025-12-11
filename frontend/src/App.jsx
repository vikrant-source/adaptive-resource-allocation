import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Dashboard from "./pages/Dashboard.jsx";
import TopBar from "./components/TopBar.jsx";
import ControlPanel from "./components/ControlPanel.jsx";
import ProcessForm from "./components/ProcessForm.jsx";
import ProcessTable from "./components/ProcessTable.jsx";
import BottleneckAlert from "./components/BottleneckAlert.jsx";
import MetricPill from "./components/MetricPill.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import GuidedTour from "./components/GuidedTour.jsx";
import AdaptiveSchedulingCard from "./components/AdaptiveSchedulingCard.jsx";
import ProcessStateVisualizer from "./components/ProcessStateVisualizer.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import AvgMetricsCard from "./components/AvgMetricsCard.jsx";
import PriorityExplanationCard from "./components/PriorityExplanationCard.jsx";
import { addProcess, fetchMetrics, startSimulation, stopSimulation } from "./api.js";
import { initTheme, setTheme } from "./theme.js";

const initialMetrics = {
  cpu: 0,
  memory_used: 0,
  memory_total: 0,
  memory_pressure: 0,
  page_faults: 0,
  quantum_ms: 0,
  bottlenecks: [],
  history: [],
  running: false,
  processes: [],
};

function App() {
  const [theme, setThemeState] = useState(() => initTheme());
  const [metrics, setMetrics] = useState(initialMetrics);
  const [processes, setProcesses] = useState([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [showTour, setShowTour] = useState(() => {
    return !localStorage.getItem("tour-completed");
  });

  const handleThemeChange = useCallback((newTheme) => {
    setThemeState(newTheme);
    setTheme(newTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setTheme(theme);
  }, [theme]);

  const loadMetrics = useCallback(async () => {
    try {
      const data = await fetchMetrics();
      setMetrics(data);
      
      // Mark completion time for newly completed processes
      const updatedProcesses = (data.processes || []).map((p) => {
        if (p.state === "completed" && p.completion_time && !p._completedTime) {
          return { ...p, _completedTime: Date.now() };
        }
        return p;
      });
      
      setProcesses(updatedProcesses);
      setRunning(Boolean(data.running));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
    const id = setInterval(loadMetrics, 2000);
    return () => clearInterval(id);
  }, [loadMetrics]);

  // Fade out completed processes after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setProcesses((prev) =>
        prev.filter((p) => {
          if (p.state === "completed" && p._completedTime) {
            return Date.now() - p._completedTime < 5000;
          }
          return true;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      await startSimulation();
      setToast("Simulation started");
      await loadMetrics();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await stopSimulation();
      setToast("Simulation stopped");
      await loadMetrics();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProcess = async (payload) => {
    setLoading(true);
    try {
      await addProcess(payload);
      setToast("Process added");
      await loadMetrics();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickAdd = async (preset) => {
    await handleAddProcess({ workload: preset, name: `${preset}-batch` });
  };

  const themeToggle = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    handleThemeChange(newTheme);
  }, [theme, handleThemeChange]);

  const headlineMetrics = useMemo(
    () => [
      { label: "CPU", value: `${metrics.cpu ?? 0}%`, accent: "from-blue-500/80 to-cyan-400/80", icon: "🧠" },
      {
        label: "Memory",
        value: `${metrics.memory_used ?? 0} / ${metrics.memory_total ?? 0} MB`,
        accent: "from-indigo-500/80 to-violet-500/80",
        icon: "💾",
      },
      { label: "Quantum", value: `${metrics.quantum_ms ?? 0} ms`, accent: "from-emerald-500/80 to-teal-400/80", icon: "⏱️" },
    ],
    [metrics.cpu, metrics.memory_total, metrics.memory_used, metrics.quantum_ms],
  );

  return (
    <div className="min-h-screen pb-12 px-4 sm:px-8 md:px-16 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        <TopBar theme={theme} onToggleTheme={themeToggle} running={running} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {headlineMetrics.map((m) => (
            <MetricPill key={m.label} label={m.label} value={m.value} accent={m.accent} icon={m.icon} />
          ))}
        </div>

        <Dashboard metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ControlPanel
            running={running}
            loading={loading}
            onStart={handleStart}
            onStop={handleStop}
            onQuickAdd={quickAdd}
          />
          <ProcessForm loading={loading} onSubmit={handleAddProcess} />
          <BottleneckAlert alerts={metrics.bottlenecks || []} />
        </div>

        <HowItWorks />

        <ProcessStateVisualizer processes={processes} />

        <ProcessTable processes={processes} />

        <PriorityExplanationCard />

        <AvgMetricsCard processes={processes} />

        <AdaptiveSchedulingCard />
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-6 right-6 glass px-4 py-3 text-sm font-medium"
            onAnimationComplete={() => setTimeout(() => setToast(""), 2000)}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <GuidedTour
        open={showTour}
        onClose={() => {
          setShowTour(false);
          localStorage.setItem("tour-completed", "true");
        }}
      />
    </div>
  );
}

export default App;

