## Project Overview
- **Goal:** Dynamically adjust CPU time slices and working sets for concurrent processes while surfacing real-time health metrics.
- **Expected Outcome:** Smooth dashboard with live CPU/memory charts, process list, bottleneck alerts, priority visualization, and controllable simulation (start/stop/add workload).
- **Scope:** Single-node simulator (no real kernel hooks) that models scheduling, working-set memory, and paging signals; exposes REST APIs consumed by a modern UI.
- **Real-time OS Angle:** Periodic tick loop recalculates adaptive quantum, process priorities, working sets, and bottlenecks; frontend polls every 2s for fresh metrics.
- **Why Adaptive Scheduling:** Prevents starvation, responds to load spikes (CPU bound vs I/O bound), and moderates memory pressure with working-set resizing to avoid thrashing.

## Module-Wise Breakdown (3 modules)
### Module 1 – Scheduler Engine (Backend)
- CPU scheduling with adaptive quantum, priority aging, I/O-bound awareness.
- Memory manager with working-set model and page-fault simulation.
- Bottleneck analysis (CPU, memory pressure, paging, quantum shrink events).
- Live metrics aggregation + REST endpoints (`/api/start`, `/api/stop`, `/api/add_process`, `/api/metrics`).

### Module 2 – Frontend UI (React)
- Dashboard layout with iOS glassmorphism, rounded cards, soft shadows.
- Charts: CPU line, Memory area, Timeline (quantum + page faults).
- **Process State Visualizer:** Real-time counts of Ready/Running/Waiting/Blocked/Completed states with animated badges.
- **Process Table:** Live process list with priority badges (HIGH/MED/LOW), completion time estimates, and "Next to run" indicator.
- **Priority Explanation Card:** Visual guide explaining how priority scheduling works (lower number = higher priority).
- **Average Metrics Card:** Real-time calculation of Average Turnaround Time, Waiting Time, and Response Time.
- Bottleneck alerts, process creation form, control panel (start/stop/workloads).
- **Theme System:** Persistent light/dark mode toggle with iOS-style animated switch.
- **Completed Processes:** Processes marked as "completed" remain visible for 5 seconds with fade-out animation.

### Module 3 – Data Visualization + Reporting
- Real-time chart rendering (Recharts) with Framer Motion micro-interactions.
- Timeline visualization for scheduler quantum + paging.
- Metrics panel and pills for quick-glance stats.
- Theme engine toggling class-based Tailwind dark mode.

## Functionalities
- **Key Features:** 
  - Start/stop simulation; add custom or preset workload processes
  - Adaptive quantum scheduling (adjusts based on CPU load)
  - Priority-based scheduling with aging (prevents starvation)
  - Working-set memory management with growth/shrink
  - Bottleneck detection (CPU, memory, paging)
  - Live charts (CPU, Memory, Timeline)
  - Process state visualization (Ready/Running/Waiting/Blocked/Completed)
  - Priority badges and "Next to run" indicator
  - Average metrics calculation (TAT, WT, RT)
  - Completed process tracking with fade-out
  - iOS-style theme toggle with persistence
- **Example Use Cases:** 
  - Inject heavy workload batch to watch CPU + memory pressure
  - Add I/O-bound light tasks to see quantum relax
  - Observe page faults when memory tight
  - Watch priority scheduling in action (higher priority runs first)
  - See processes complete and fade out gracefully
- **Real-time Interactions:** Frontend polls `/api/metrics` every 2s; backend tick loop updates CPU, memory, paging, and bottleneck flags each second. Processes complete when `cpu_burst <= 0.1` and remain visible for 5 seconds.

## Technology Recommendations
- **React + Vite:** Fast dev server and modern JSX tooling for smooth UI.
- **Tailwind CSS:** Rapid iOS-style glassmorphism with utility classes and dark mode.
- **Recharts:** Lightweight, responsive charts for CPU and memory trends.
- **Framer Motion:** Subtle animations for toggles, buttons, and alert transitions.
- **Python Flask:** Simple, lightweight API layer ideal for iterative simulations.
- **Axios:** Predictable HTTP client with base URL and timeout handling.
- **GitHub:** Versioned collaboration; pair with branch-per-feature workflow.

## Execution Plan — Step-by-step Implementation
1. **Design backend:** Create `Scheduler`, `Process`, `MemoryManager`, `BottleneckDetector`; build Flask endpoints; add background tick thread; expose metrics history.
2. **Design frontend:** Set up Vite + Tailwind; implement light/dark theme; lay out dashboard cards; add charts and tables; wire controls to API.
3. **Connect:** Configure Axios base URL; poll `/api/metrics`; bind controls to `/api/start|stop|add_process`.
4. **Polling strategy:** 2s polling cadence; debounce UI state with loading indicators; keep small history window (30 samples) for charts.
5. **Testing:** Manual: start backend, run frontend dev server, exercise controls, validate charts update. Add quick `curl` hits to `/api/metrics` to verify JSON shape.
6. **GitHub branching (7 revisions template):**
   - `rev1-init`: scaffold backend + frontend skeleton.
   - `rev2-scheduler`: implement scheduler + memory model.
   - `rev3-api`: wire Flask endpoints and CORS.
   - `rev4-ui-shell`: layout, theme toggle, base cards.
   - `rev5-charts`: CPU/Memory/Timeline charts with polling.
   - `rev6-controls`: start/stop/workload + process form wiring.
   - `rev7-report`: finalize docs, cleanup, and polish.

## Flow Diagram (textual)
`UI Controls → Axios → /api/start|stop|add_process → Simulation Thread → Scheduler tick + Memory tick → Metrics Aggregator → /api/metrics → Axios Poller → Recharts/Components`

## Setup & Run
### Backend
```bash
cd adaptive-resource-allocation/backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5000`

### Frontend
```bash
cd adaptive-resource-allocation/frontend
npm install
npm run dev
```
Frontend dev server runs on `http://localhost:5173` (or next available port)

**Note:** Start the backend server first, then the frontend. The frontend will automatically connect to the backend API.

Note: Minor improvements will be added soon.
- Improved UI smoothness.
- Added support for additional frontend animations.
- Plan to add advanced memory optimization techniques.
### Additional Notes
This simulator is designed for educational OS concepts.


## Key Features & Components

### Backend Components
- **Scheduler (`modules/scheduler.py`):** Adaptive quantum scheduling, priority aging, I/O-bound detection, process completion tracking
- **Memory Manager (`modules/memory.py`):** Working-set model, page fault simulation
- **Metrics Aggregator (`modules/metrics.py`):** History tracking, bottleneck detection
- **Flask API (`app.py`):** REST endpoints for simulation control and metrics

### Frontend Components
- **Dashboard (`pages/Dashboard.jsx`):** Main layout with CPU/Memory/Timeline charts
- **ProcessTable (`components/ProcessTable.jsx`):** Live process list with priority badges, completion estimates, sorting
- **ProcessStateVisualizer (`components/ProcessStateVisualizer.jsx`):** Animated state counts with glowing indicators
- **PriorityExplanationCard (`components/PriorityExplanationCard.jsx`):** Educational card explaining priority scheduling
- **AvgMetricsCard (`components/AvgMetricsCard.jsx`):** Real-time calculation of average scheduling metrics
- **ThemeToggle (`components/ThemeToggle.jsx`):** iOS-style animated theme switcher
- **AdaptiveSchedulingCard (`components/AdaptiveSchedulingCard.jsx`):** Explains adaptive quantum, priority aging, I/O detection

### Process Completion
- Processes complete when `cpu_burst <= 0.1`
- Completion time depends on:
  - Initial CPU burst (light: 8-18s, medium: 25-55s, heavy: 60-92s)
  - I/O bound factor (I/O-bound processes progress slower)
  - CPU load (affects quantum size: 50-90ms)
  - Number of competing processes
- Completed processes remain visible for 5 seconds with fade-out animation
- Estimated completion time shown in Process Table (e.g., "10.5% (~131s)")

### Priority System
- **Lower number = Higher priority** (Priority 1 runs before Priority 2)
- Priority badges: HIGH (1-2), MEDIUM (3), LOW (4+)
- Priority aging prevents starvation (waiting processes get priority boosts)
- "Next to run" indicator highlights the highest priority ready process

## Report Sections (LPU-friendly)
- Project Overview
- Module-Wise Breakdown
- Functionalities
- Technology Used
- Flow Diagram
- Revision Tracking (use template above)
- Conclusion & Future Scope: extend to multi-node, add RL-based scheduling, plug real OS telemetry.
- References: Flask docs, React docs, Tailwind, Recharts, Framer Motion.
- Appendix: AI-Generated Breakdown, Problem Statement, Complete Project Code (paths as above).

## Recent Updates
- ✅ Added Process State Visualizer with animated badges
- ✅ Enhanced Process Table with priority badges and completion time estimates
- ✅ Added Priority Explanation Card for educational purposes
- ✅ Implemented Average Metrics Card (TAT, WT, RT)
- ✅ Added iOS-style theme toggle with persistence
- ✅ Completed processes now remain visible with fade-out animation
- ✅ Fixed process completion logic (processes now complete properly)
- ✅ Added "Next to run" indicator based on priority

## Future Scope
- Incorporate true workload replay traces.
- Add WebSocket push for lower-latency updates.
- Introduce eviction policies (LRU/WSClock) and CPU affinity simulation.
- Add Gantt chart visualization for CPU scheduling timeline.
- Implement process lifecycle rings (CPU/Memory/I/O progress).
- Add guided tour for first-time users.

