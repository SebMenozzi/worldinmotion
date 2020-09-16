const { app, BrowserWindow, Menu, protocol } = require('electron')
const path = require('path');
const Store = require('./store.js');

process.env.GOOGLE_API_KEY = 'AIzaSyCIx91ZLnyDvLEhkI9OFSH1zLfp53nBgbw'

let mainWindow;

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 800, height: 600 }
  }
});

app.on('ready', () => {

  // First we'll get our height and width. This will be the defaults if there wasn't anything saved
  let { width, height } = store.get('windowBounds');

  app.commandLine.appendSwitch('disable-web-security');

  mainWindow = new BrowserWindow({ // Pass those values in to the BrowserWindow options
    width: width,
    height: height,
    titleBarStyle: "hidden-inset",
    darkTheme: true,
    backgroundColor: "#000",
    show: false,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  })

  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let { width, height } = mainWindow.getBounds();
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
  });

  mainWindow.setMinimumSize(800, 600)
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.webContents.openDevTools()
});
