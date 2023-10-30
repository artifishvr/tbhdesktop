const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { autoUpdater } = require("electron-updater")
const client = require('discord-rich-presence')('1168086644574933052');

let mainWindow;

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
};

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();

  client.updatePresence({
    details: 'yippie-ing',
    startTimestamp: Date.now(),
    largeImageKey: 'tbh',
    largeImageText: 'tbh',
    buttons: [{ label: 'get the app', url: 'https://github.com/artificialbutter/tbhdesktop' }]
  });
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
  } else if (process.platform === 'linux') {
    exec('systemctl suspend', (error) => {
      if (error) {
        console.error(`Error: ${error.message}`);
      }
    });
    process.exit();
  } else {
    console.log("Can't shutdown on this platform")
  }
})
