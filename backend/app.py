import threading
import time
from flask import Flask, jsonify, request
from flask_cors import CORS

from modules.scheduler import Process, Scheduler
from modules.memory import MemoryManager
from modules.metrics import BottleneckDetector, MetricsAggregator


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    return app





class Simulation:
    def __init__(self) -> None:
        self.app = create_app()
        self.scheduler = Scheduler()
        self.memory = MemoryManager(total_memory_mb=16384)
        self.metrics = MetricsAggregator(history_seconds=120)
        self.detector = BottleneckDetector()
        self._lock = threading.Lock()
        self._running = False
        self._thread: threading.Thread | None = None
        self._wire_routes()

    def _wire_routes(self) -> None:
        app = self.app

        @app.route("/api/start", methods=["POST"])
        def start():
            self.start_simulation()
            return jsonify({"status": "running"})

        @app.route("/api/stop", methods=["POST"])
        def stop():
            self.stop_simulation()
            return jsonify({"status": "stopped"})

        @app.route("/api/add_process", methods=["POST"])
        def add_process():
            payload = request.get_json(force=True) or {}
            proc = self.add_process(payload)
            return jsonify({"added": proc.to_dict(), "count": len(self.scheduler.processes)})

        @app.route("/api/metrics", methods=["GET"])
        def metrics():
            snapshot = self.latest_metrics()
            return jsonify(snapshot)

    def start_simulation(self) -> None:
        with self._lock:
            if self._running:
                return
            self._running = True
            self._thread = threading.Thread(target=self._run_loop, daemon=True)
            self._thread.start()

    def stop_simulation(self) -> None:
        with self._lock:
            self._running = False

    def add_process(self, payload: dict) -> Process:
        proc = Process.from_payload(payload)
        with self._lock:
            self.scheduler.add_process(proc)
        return proc

    def _run_loop(self) -> None:
        while True:
            with self._lock:
                if not self._running:
                    break
                sched_metrics = self.scheduler.tick()
                mem_metrics = self.memory.tick(self.scheduler.processes)
                combined = {**sched_metrics, **mem_metrics}
                combined["bottlenecks"] = self.detector.detect(combined)
                self.metrics.push(combined)
            time.sleep(1)

    def latest_metrics(self) -> dict:
        with self._lock:
            snapshot = self.metrics.snapshot()
            snapshot["processes"] = [p.to_dict() for p in self.scheduler.processes]
            snapshot["running"] = self._running
        return snapshot


simulation = Simulation()
app = simulation.app


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

