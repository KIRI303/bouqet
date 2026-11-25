(() => {
  "use strict";

  const terminalElement = document.querySelector("#terminal");
  const status = document.querySelector("#status");
  if (typeof Terminal === "undefined" || typeof FitAddon === "undefined") {
    status.className = "connection-status offline";
    status.querySelector("span").textContent = "terminal library unavailable";
    terminalElement.textContent = "Terminal assets failed to load. Check your internet connection and reload.";
    return;
  }
  const terminal = new Terminal({
    allowProposedApi: false,
    convertEol: true,
    cursorBlink: false,
    cursorStyle: "bar",
    fontFamily: "'Cascadia Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
    fontSize: 13,
    lineHeight: 1.08,
    scrollback: 0,
    theme: {
      background: "#211c22",
      foreground: "#f1e8e8",
      cursor: "#f1c7c5",
      selectionBackground: "#77505d80",
      black: "#211c22",
      red: "#df7181",
      green: "#8cae87",
      yellow: "#e9c47b",
      blue: "#8ba9d0",
      magenta: "#c99bc7",
      cyan: "#85c1bd",
      white: "#f1e8e8",
      brightBlack: "#80757d",
      brightRed: "#f397a2",
      brightGreen: "#b2ce9e",
      brightYellow: "#f5d892",
      brightBlue: "#adc2e4",
      brightMagenta: "#e1b8dc",
      brightCyan: "#a6d9d2",
      brightWhite: "#fff9f4",
    },
  });
  const fitAddon = new FitAddon.FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(terminalElement);

  let socket;
  let resizeTimer;
  let hasConnected = false;

  function setStatus(label, state) {
    status.className = `connection-status ${state}`;
    status.querySelector("span").textContent = label;
  }

  function sendResize() {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    fitAddon.fit();
    socket.send(JSON.stringify({ type: "resize", cols: terminal.cols, rows: terminal.rows }));
  }

  function connect() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    socket = new WebSocket(`${protocol}//${window.location.host}/terminal`);
    socket.binaryType = "arraybuffer";

    socket.addEventListener("open", () => {
      hasConnected = true;
      setStatus("connected", "online");
      sendResize();
      terminal.focus();
    });

    socket.addEventListener("message", (event) => {
      if (event.data instanceof ArrayBuffer) {
        terminal.write(new Uint8Array(event.data));
      } else if (typeof event.data === "string") {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "error") terminal.write(`\r\n\x1b[38;5;203m${message.message}\x1b[0m\r\n`);
        } catch {
          terminal.write(event.data);
        }
      }
    });

    socket.addEventListener("close", () => {
      setStatus("disconnected", "offline");
      if (hasConnected) {
        terminal.write("\r\n\x1b[38;5;245mSession ended. Reload the page to start a new bouquet.\x1b[0m\r\n");
      } else {
        terminal.write("\r\n\x1b[38;5;203mCould not connect to the bouquet server.\x1b[0m\r\n");
      }
    });

    socket.addEventListener("error", () => setStatus("connection error", "offline"));
  }

  terminal.onData((data) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "input", data }));
    }
  });

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(sendResize, 100);
  }, { passive: true });

  connect();
})();
