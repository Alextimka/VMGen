const { app, BrowserWindow, dialog, screen, ipcMain } = require('electron');
const fs = require("node:fs");
const path = require('node:path');
const { toJson } = require('xml2json')

// Создание/Удаление ярлыков в Windows при установке/удалении.
if (require('electron-squirrel-startup')) { 
  app.quit();
}

const projectSelect = () => {
  // Создать окно браузера
  displaySize = screen.getPrimaryDisplay().size;
  
  const projects = new BrowserWindow({
    width: 700,
    height: 455,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'pages/projects/js/preload.js'),
    },
  });
  // Загрузить projects.html
  projects.loadFile(path.join(__dirname, 'pages/projects/projects.html'));
};
ipcMain.on('toJson', (event, args) => {
  try {
    event.returnValue = {value: toJson(args['xml']), success: true}
  } catch (error) {
    event.returnValue = {error: error, success: false}
  }
});
ipcMain.on('openFile', (event, args) => {
  dialog.showOpenDialog({ 
    properties: [
      (args["folder"]) ? "openDirectory" : "openFile", 
      (args["multiple"]) ? "multiSelections" : "", 
    ], 
    filters: [{ 
      name: args["desc"], 
      extensions: args["fileTypes"]
    }]
  }).then(
    (value) => {
      if (value['canceled']) return 0;
      let files;
      if (args["folder"]) {
        files = value["filePaths"];
        console.log(files);
        
      } else {
        files = [];
        let paths = value["filePaths"]
        
        for (let i = 0; i < paths.length; i++) {
          files[i] = fs.readFileSync(paths[i], 'utf8')
        }
      }
      event.returnValue = {value: files, success: true}
    }
  ).catch(
    (err) => {
      event.returnValue = {error: err, success: false}
    }
  );
  
});

ipcMain.on('newPrj', (event, args) => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    minWidth: 1000,
    height: 600,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'pages/main/js/preload.js'),
    },
  });
  // Загрузить projects.html
  mainWindow.loadFile(path.join(__dirname, 'pages/main/main.html'));
  mainWindow.once("focus", ()=>{mainWindow.maximize();});
  
  event.returnValue = {success: true};
})

app.whenReady().then(() => {
  projectSelect();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      projectSelect();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
