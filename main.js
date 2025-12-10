const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec, spawn } = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // DEV: load Next.js dev server
  win.loadURL("http://localhost:3000");

  // PROD: load built Next.js
  // win.loadFile(path.join(__dirname, "../out/index.html"));

}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const { ipcMain } = require("electron");
const loudness = require('loudness');

ipcMain.handle("ping", () => {
  return "pong from electron";
});

ipcMain.handle('set-brightness', async (event, value) => {
  // value expected 0-100
  const intVal = Math.max(0, Math.min(100, parseInt(value)));
  return new Promise((resolve, reject) => {
    // Use WMI method to set monitor brightness (works for many internal displays)
    const cmd = `powershell -Command "(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,${intVal})"`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        resolve({ ok: false, error: stderr || err.message });
      } else {
        resolve({ ok: true });
      }
    });
  });
});

ipcMain.handle('get-brightness', async () => {
  return new Promise((resolve) => {
    const cmd = `powershell -Command "(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness)[0].CurrentBrightness"`;
    exec(cmd, (err, stdout) => {
      if (err) return resolve({ ok: false, error: err.message });
      const v = parseInt(stdout);
      if (isNaN(v)) resolve({ ok: false, error: 'parse' });
      else resolve({ ok: true, value: v });
    });
  });
});

ipcMain.handle('set-volume', async (event, value) => {
  const intVal = Math.max(0, Math.min(100, parseInt(value)));
  try {
    await loudness.setVolume(intVal);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('get-volume', async () => {
  try {
    const v = await loudness.getVolume();
    return { ok: true, value: v };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('open-powershell', async () => {
  return new Promise((resolve) => {
    try {
      const ps = spawn('powershell.exe', [], {
        detached: true,
        stdio: 'ignore',
        shell: true,
      });
      ps.unref(); // Allow parent process to exit independently
      resolve({ ok: true });
    } catch (err) {
      resolve({ ok: false, error: err.message });
    }
  });
});
