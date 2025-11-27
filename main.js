const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
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

ipcMain.handle("ping", () => {
  return "pong from electron";
});

