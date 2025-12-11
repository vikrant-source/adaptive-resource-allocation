import random
import time
from typing import List

from .scheduler import Process


class MemoryManager:
    def __init__(self, total_memory_mb: int = 16384) -> None:
        self.total_memory_mb = total_memory_mb
        self.used_memory_mb = 0
        self.page_faults = 0
        self.working_sets: dict[int, int] = {}
        self.last_updated = time.time()

    def tick(self, processes: List[Process]) -> dict:
        now = time.time()
        elapsed = max(1.0, now - self.last_updated)
        self.last_updated = now

        usage = 0
        for proc in processes:
            working_set = self.working_sets.get(proc.pid, proc.memory_mb)
            delta = random.randint(-32, 48)
            working_set = max(64, working_set + delta)
            self.working_sets[proc.pid] = working_set
            usage += working_set
            if random.random() < 0.08:
                self.page_faults += 1

        self.used_memory_mb = min(self.total_memory_mb, usage)
        pressure = self.used_memory_mb / self.total_memory_mb

        if pressure > 0.9:
            self._shrink_working_sets(processes, factor=0.85)
        elif pressure < 0.5:
            self._expand_working_sets(processes, factor=1.05)

        return {
            "memory_used": round(self.used_memory_mb, 2),
            "memory_total": self.total_memory_mb,
            "memory_pressure": round(pressure * 100, 2),
            "page_faults": self.page_faults,
            "memory_timestamp": now,
        }

    def _shrink_working_sets(self, processes: List[Process], factor: float) -> None:
        for proc in processes:
            ws = self.working_sets.get(proc.pid, proc.memory_mb)
            self.working_sets[proc.pid] = max(64, int(ws * factor))

    def _expand_working_sets(self, processes: List[Process], factor: float) -> None:
        for proc in processes:
            ws = self.working_sets.get(proc.pid, proc.memory_mb)
            self.working_sets[proc.pid] = min(proc.memory_mb * 2, int(ws * factor))

