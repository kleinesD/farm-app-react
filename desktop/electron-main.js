// TEST COMMIT ||| DELETE LATER

const { app, BrowserWindow, BrowserView, screen, ipcMain, session, globalShortcut } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const updater = require('./updater.ts');


const expressApp = require('../server/app');
const server = require('../server/server');

/* To disable "Passthrough is not supported, GL is disabled, ANGLE is" error. */
app.disableHardwareAcceleration()

let mainWindow;



const createWindow = () => {

  // Check for app updates
  setTimeout(() => {

  }, 3000);

  let ses = session.defaultSession;


  let displays = screen.getAllDisplays()

  /* Showing an app on external screen if there is one and if in development mode */

  if (process.env.NODE_ENV === 'development' && displays.length > 1) {
    mainWindow = new BrowserWindow({
      minWidth: 1200, minHeight: 600,
      x: displays[1].bounds.x, y: displays[1].bounds.y,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        enableRemoteModule: true
      },
      autoHideMenuBar: true,
      backgroundColor: '#f7f0dd',
      show: false
    });
  } else {
    mainWindow = new BrowserWindow({
      minWidth: 1200, minHeight: 600,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        enableRemoteModule: true
      },
      autoHideMenuBar: true,
      backgroundColor: '#f7f0dd',
      show: false
    });
  }
  /* mainWindow = new BrowserWindow({
    minWidth: 1200, minHeight: 600,
    webPreferences: {
      nodeIntegration: true, // Allows using Node.js APIs in the renderer
      contextIsolation: false, // Allow access to Electron APIs
      enableRemoteModule: true, // For older Electron versions
    },
    autoHideMenuBar: true,
    backgroundColor: '#f7f0dd',
    show: false
  }); */

  // Define the environment variable for PUBLIC_URL
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      window.process.env.PUBLIC_URL = '${path.resolve(__dirname, '..', 'client', 'public')}';
    `);

    /* session.defaultSession.cookies.set({
      url: 'http://127.0.0.1:604', // Must match your Express API domain
      name: 'jwt',
      value: 'YOUR_JWT_TOKEN',
      path: '/',
      httpOnly: true,
      secure: true, // Change to `true` in production
      sameSite: 'lax'
    }).then(() => {
      console.log('Cookie set successfully');
    }).catch(error => {
      console.error('Failed to set cookie:', error);
    }); */

    session.defaultSession.cookies.get({})
      .then((cookies) => {
        console.log("All Cookies:", cookies);
      })
      .catch(console.error);

    session.defaultSession.cookies.on('changed', (event, cookie, cause, removed) => {
      console.log(`Cookie changed: ${cookie.name}`);
      console.log(`Cause: ${cause}`);
      console.log(`Removed: ${removed}`);
      console.log(`New Value: ${cookie.value}`);
    });

    ipcMain.on("check-cookies", async (event) => {
      try {
        const cookies = await session.defaultSession.cookies.get({});
        console.log("Cookies updated:", cookies);
      } catch (error) {
        console.error("Error fetching cookies:", error);
      }
    });
  });


  globalShortcut.register('CommandOrControl+R', () => {
    // disable re-loading of the page
  });

  mainWindow.loadFile(path.join(__dirname, '../public/index.html'));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadFile(path.join(__dirname, '../client/public/index.html'));
  } else {
    mainWindow.loadFile(path.join(__dirname, '../client/build/index.html'));
  }


  /* mainWindow.loadURL('http://127.0.0.1:604/'); */

  /* Only for dev */
  /* if(isDev) {
    mainWindow.loadURL('http://127.0.0.1:3000/');
  } */

  // Later to include for production
  /* const startUrl = isDev
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "../client/build/index.html")}`;
mainWindow.loadURL(startUrl); */


  mainWindow.maximize();
  mainWindow.show();

  mainWindow.webContents.on('dom-ready', (e) => {

  });

  if (isDev) mainWindow.webContents.openDevTools();


  mainWindow.on('closed', () => {
    mainWindow = null;
    menuWindow = null;
    app.quit();
  });
}

/* ipcMain.on('cookie-channel', (e, cookie) => {
  console.log(cookie);
}); */


app.on('ready', createWindow);

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})