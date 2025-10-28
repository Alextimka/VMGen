const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('projects', {
  newPrj: () => {
    response = ipcRenderer.sendSync("openFile", {
      desc: "Выберите папку для проекта", 
      fileTypes: "",
      multiple: false,
      folder: true
    });
    if (response['success']) {
      if (response["value"]['canceled']) return 0;
      ipcRenderer.sendSync("newPrj", {folderPath: response["value"]});
      window.close();

    }
  },
  openFile: (desc, fileTypes, multiple, folder) => {
    response = ipcRenderer.sendSync("openFile", {
      desc: desc, 
      fileTypes: fileTypes,
      multiple: multiple,
      folder: folder
    });
    if (response['success']) {
      if (response["value"]['canceled']) return 0;
      console.log(response);
      
      // console.log(ipcRenderer.sendSync("readFile", {
      //   path: files[fileTypes[0]]
      // }));
    } else {
      console.error(response['error']);
      
    }
  },
  
});