const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const electron = require('electron')

/*获取electron窗体的菜单栏*/
const Menu = electron.Menu
/*隐藏electron创听的菜单栏*/
Menu.setApplicationMenu(null)


function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'main/preload.js')
    }
  })

  if (!app.isPackaged) {
    win.loadFile('out/index.html') 
  } else {
    win.loadFile(path.join(process.resourcesPath, "index.html"));
  }

  win.once('ready-to-show', (event) => {
      win.show()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})




