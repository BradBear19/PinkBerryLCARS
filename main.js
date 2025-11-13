const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false,
    frame: true, //toggle for dev tool bar

    webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
  })

  win.setMenuBarVisibility(true)

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})