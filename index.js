const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { autoUpdater } = require("electron-updater")

let mainWindow;
let yippeeWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 700,
    height: 770,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });
};

const createYippee = () => {
  yippeeWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Start hidden
  });
  yippeeWindow.loadFile(path.join(__dirname, 'src/null.html'));
};

let tray = null
let playing = false;
function playSoundHidden() {
  yippeeWindow.loadFile(path.join(__dirname, 'src/sound.html'));
  playing = true;
  setTimeout(() => {
    yippeeWindow.loadFile(path.join(__dirname, 'src/null.html'));
    playing = false;
  }, 2000);
}

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();

});


ipcMain.on('tbh', (event) => {
  // Execute the shutdown command
  if (process.platform === 'win32') {
    exec('rundll32.exe powrprof.dll, SetSuspendState Sleep', (error) => {
      if (error) {
        console.error(`Error: ${error.message}`);
      }
    });
    process.exit();
  } else if (process.platform === 'darwin') {
    exec('pmset sleepnow', (error) => {
      if (error) {
        console.error(`Error: ${error.message}`);
      }
    });
    process.exit();
  } else {
    console.log("Can't shutdown on this platform")
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
