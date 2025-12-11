import random
import time
from dataclasses import dataclass, field
from typing import List


WORKLOAD_PRESETS = {
    "light": {"cpu": (8, 18), "io_bound": 0.6, "memory_mb": (120, 256)},
    "medium": {"cpu": (25, 55), "io_bound": 0.3, "memory_mb": (256, 768)},
    "heavy": {"cpu": (60, 92), "io_bound": 0.15, "memory_mb": (768, 2048)},
}


@dataclass
class Process:
    pid: int
    name: str
    priority: int
    workload: str
    cpu_burst: float
    io_bound: float
    memory_mb: int
    aging: int = 0
    state: str = "ready"
    last_seen: float = field(default_factory=time.time)
    initial_burst: float = field(init=False)
    cpu_time_used: float = 0.0
    completion_time: float = 0.0

    def __post_init__(self):
        self.initial_burst = self.cpu_burst

    def to_dict(self) -> dict:
        return {
            "pid": self.pid,
            "name": self.name,
            "priority": self.priority,
            "workload": self.workload,
            "cpu_burst": self.cpu_burst,
            "io_bound": self.io_bound,
            "memory_mb": self.memory_mb,
            "aging": self.aging,
            "state": self.state,
            "completion_time": self.completion_time,
        }

    @classmethod
    def from_payload(cls, payload: dict) -> "Process":
        workload = payload.get("workload", "medium")
        preset = WORKLOAD_PRESETS.get(workload, WORKLOAD_PRESETS["medium"])
        pid = int(time.time() * 1000) + random.randint(1, 500)
        name = payload.get("name") or f"Process-{pid % 10000}"
        priority = int(payload.get("priority", random.randint(1, 5)))
        cpu_range = payload.get("cpu_range") or preset["cpu"]
        cpu_burst = float(payload.get("cpu_burst") or random.uniform(*cpu_range))
        io_bound = float(payload.get("io_bound") or preset["io_bound"])
        memory_range = payload.get("memory_range") or preset["memory_mb"]
        memory_mb = int(payload.get("memory_mb") or random.randint(*memory_range))
        return cls(
            pid=pid,
            name=name,
            priority=priority,
            workload=workload,
            cpu_burst=cpu_burst,
            io_bound=io_bound,
            memory_mb=memory_mb,
        )


class Scheduler:
    def __init__(self) -> None:
        self.processes: List[Process] = []
        self.quantum_ms: int = 80
        self.cpu_utilization: float = 0.0
        self.time_slice = 0

    def add_process(self, process: Process) -> None:
        self.processes.append(process)

    def _adaptive_quantum(self) -> None:
        load = self.cpu_utilization
        if load > 85:
            self.quantum_ms = 50
        elif load > 70:
            self.quantum_ms = 70
        else:
            self.quantum_ms = 90

    def _priority_aging(self) -> None:
        for proc in self.processes:
            proc.aging += 1
            if proc.aging > 5 and proc.priority > 1:
                proc.priority -= 1
                proc.aging = 0

    def _select_process(self) -> Process | None:
        if not self.processes:
            return None
        # Filter out completed processes
        active = [p for p in self.processes if p.cpu_burst > 0.1 and p.state != "completed"]
        if not active:
            return None
        scored = sorted(
            active,
            key=lambda p: (p.priority, -p.cpu_burst, p.io_bound, p.pid),
        )
        return scored[0]

    def tick(self) -> dict:
        now = time.time()
        proc = self._select_process()
        
        if proc:
            proc.state = "running"
            proc.last_seen = now
            
            # Calculate CPU usage for metrics
            cpu_spike = random.uniform(0.8, 1.2)
            cpu_use = min(100.0, proc.cpu_burst * cpu_spike)
            io_penalty = proc.io_bound * random.uniform(0.1, 0.3)
            cpu_use = max(5.0, cpu_use * (1 - io_penalty))
            self.cpu_utilization = (self.cpu_utilization * 0.4) + (cpu_use * 0.6)
            
            # Decrease burst time based on quantum (convert ms to seconds)
            # Each tick processes work equal to quantum_ms worth of CPU time
            quantum_seconds = self.quantum_ms / 1000.0
            work_done = quantum_seconds * (1.0 - proc.io_bound * 0.3)  # I/O bound processes do less work
            
            # Decrease burst time
            proc.cpu_burst = max(0.0, proc.cpu_burst - work_done)
            proc.cpu_time_used += work_done
            
            # Mark as completed if burst is very low and not already completed
            if proc.cpu_burst <= 0.1 and proc.state != "completed":
                proc.state = "completed"
                proc.cpu_burst = 0.0
                proc.completion_time = now
            elif proc.state != "completed":
                proc.aging = max(0, proc.aging - 1)
            
            self.time_slice += self.quantum_ms
        else:
            self.cpu_utilization *= 0.8

        self._adaptive_quantum()
        self._priority_aging()
        self._rebalance_io_bound(now)

        return {
            "cpu": round(self.cpu_utilization, 2),
            "quantum_ms": self.quantum_ms,
            "running_pid": proc.pid if proc else None,
            "time_slice": self.time_slice,
            "process_count": len(self.processes),
        }

    def _rebalance_io_bound(self, now: float) -> None:
        for proc in self.processes:
            if proc.state == "completed":
                continue
            if now - proc.last_seen > 8:
                proc.state = "waiting"
            elif proc.state != "running":
                proc.state = "ready"

