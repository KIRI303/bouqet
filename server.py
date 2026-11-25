"""Serve the browser terminal and launch one isolated bouquet per visitor."""

from __future__ import annotations

import fcntl
import json
import os
import pty
import select
import signal
import struct
import sys
import termios
import threading
from pathlib import Path

from flask import Flask, abort, send_from_directory
from flask_sock import Sock


ROOT = Path(__file__).resolve().parent
app = Flask(__name__)
sock = Sock(app)


@app.get("/")
def home():
    return send_from_directory(ROOT, "index.html")


@app.get("/<path:asset>")
def static_asset(asset: str):
    if asset not in {"app.js", "style.css"}:
        abort(404)
    return send_from_directory(ROOT, asset)


def _resize_terminal(fd: int, child_pid: int, cols: int, rows: int) -> None:
    cols = max(20, min(200, cols))
    rows = max(12, min(80, rows))
    size = struct.pack("HHHH", rows, cols, 0, 0)
    fcntl.ioctl(fd, termios.TIOCSWINSZ, size)
    try:
        os.kill(child_pid, signal.SIGWINCH)
    except ProcessLookupError:
        pass


@sock.route("/terminal")
def terminal_session(ws):
    """Bridge browser terminal bytes to the existing program through a PTY."""
    child_pid, master_fd = pty.fork()
    if child_pid == 0:
        os.chdir(ROOT)
        os.execv(sys.executable, [sys.executable, "-u", str(ROOT / "bouqet.py")])

    closed = threading.Event()

    def forward_output() -> None:
        while not closed.is_set():
            try:
                readable, _, _ = select.select([master_fd], [], [], 0.1)
                if not readable:
                    continue
                data = os.read(master_fd, 16_384)
                if not data:
                    break
                ws.send(data)
            except Exception:
                break
        closed.set()
        try:
            ws.close()
        except Exception:
            pass

    reader = threading.Thread(target=forward_output, name="bouquet-pty-reader", daemon=True)
    reader.start()

    try:
        while not closed.is_set():
            message = ws.receive()
            if message is None:
                break
            if not isinstance(message, str):
                continue
            try:
                command = json.loads(message)
            except json.JSONDecodeError:
                continue

            if command.get("type") == "input":
                data = command.get("data", "")
                if isinstance(data, str) and data:
                    os.write(master_fd, data.encode("utf-8"))
            elif command.get("type") == "resize":
                cols, rows = command.get("cols"), command.get("rows")
                if isinstance(cols, int) and isinstance(rows, int):
                    _resize_terminal(master_fd, child_pid, cols, rows)
    except Exception:
        pass
    finally:
        closed.set()
        try:
            os.killpg(child_pid, signal.SIGTERM)
        except ProcessLookupError:
            pass
        try:
            os.close(master_fd)
        except OSError:
            pass
        try:
            os.waitpid(child_pid, 0)
        except ChildProcessError:
            pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, threaded=True)
