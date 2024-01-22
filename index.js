const { app, BrowserWindow, ipcMain, Tray } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { autoUpdater } = require("electron-updater")
const ElectronPreferences = require('electron-preferences');
const DiscordRPC = require('discord-rpc');

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

  mainWindow.on('minimize', () => {
    if (!preferences.value('toggles.tray')[0]) return;
    mainWindow.hide();

    let tray = new Tray(path.join(__dirname, 'src/trayicon.png'));

    tray.on('click', () => {
      mainWindow.show();
      tray.destroy();
    });
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
};

const preferences = new ElectronPreferences({
  config: {
    debounce: 150, // debounce preference save settings event; 0 to disable
  },

  // Preference file path. Where your preferences are saved (required)
  dataStore: path.join(app.getPath("userData"), 'preferences.json'),

  defaults: {
    toggles: {
      crash: [true],
      tray: [],
      disableRPC: [],
    },
  },

  // Preference sections visible to the UI
  sections: [
    {
      id: 'toggles',
      label: 'Preferences',
      icon: 'edit-78',
      form: {
        groups: [
          {
            fields: [
              {
                key: 'crash',
                type: "checkbox",
                options: [
                  { label: "Yippee-overload", value: true }
                ],
                help: 'The "crash" when you click too much.',
              },
              {
                key: 'tray',
                type: "checkbox",
                options: [
                  { label: "Minimize to Tray", value: true }
                ],
                help: 'When you press the minimize button, tbh will go hide in the system tray.',
              },
              {
                key: 'disableRPC',
                type: "checkbox",
                options: [
                  { label: "Disable Rich Presence", value: true }
                ],
                help: 'Disable Discord rich presence integration. Requires restart.',
              },
            ]
          },
        ]
      }
    },
  ]
});

const clientId = '1168086644574933052';
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

async function setActivity() {
  if (!rpc || !mainWindow || preferences.value('toggles.disableRPC')[0]) return;

  const clicks = await mainWindow.webContents.executeJavaScript('clicks');

  rpc.setActivity({
    details: `yippie-ing`,
    state: `yippied ${clicks} times`,
    startTimestamp,
    largeImageKey: 'tbh',
    largeImageText: `tbh v${app.getVersion()}`,
    buttons: [{ label: 'get the app', url: 'https://github.com/artificialbutter/tbhdesktop' }]
  });
}

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('tbh', (event) => {
  if (!preferences.value('toggles.crash')[0]) return;

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

rpc.on('ready', () => {
  setActivity();

  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login({ clientId }).catch(console.error);