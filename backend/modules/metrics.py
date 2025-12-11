import collections
import statistics
import time
from typing import Dict, List


class MetricsAggregator:
    def __init__(self, history_seconds: int = 120) -> None:
        self.history_seconds = history_seconds
        self._history: collections.deque[dict] = collections.deque(maxlen=history_seconds)

    def push(self, metrics: dict) -> None:
        metrics = dict(metrics)
        metrics["timestamp"] = time.time()
        self._history.append(metrics)

    def snapshot(self) -> dict:
        if not self._history:
            return {
                "cpu": 0,
                "memory_used": 0,
                "memory_total": 0,
                "memory_pressure": 0,
                "page_faults": 0,
                "quantum_ms": 0,
                "bottlenecks": [],
                "history": [],
            }
        latest = self._history[-1]
        history = list(self._history)[-30:]
        return {
            **latest,
            "history": history,
        }


class BottleneckDetector:
    def detect(self, metrics: Dict) -> List[Dict]:
        findings: List[Dict] = []
        cpu = metrics.get("cpu", 0)
        mem = metrics.get("memory_pressure", 0)
        faults = metrics.get("page_faults", 0)
        quantum = metrics.get("quantum_ms", 0)

        if cpu > 85:
            findings.append({"type": "cpu", "level": "critical", "detail": "CPU saturation"})
        elif cpu > 70:
            findings.append({"type": "cpu", "level": "warning", "detail": "High CPU load"})

        if mem > 88:
            findings.append({"type": "memory", "level": "critical", "detail": "Memory pressure high"})
        elif mem > 72:
            findings.append({"type": "memory", "level": "warning", "detail": "Memory pressure elevated"})

        if faults > 20:
            findings.append({"type": "paging", "level": "warning", "detail": "Frequent page faults"})

        if quantum < 60 and cpu > 75:
            findings.append({"type": "scheduler", "level": "info", "detail": "Adaptive quantum reduced"})

        return findings

