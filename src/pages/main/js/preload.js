const { contextBridge, ipcRenderer } = require('electron');

const files = {jsonField: [], xmlStructure: []};
window.projectTitle = window.process.argv.at(-1); 
// console.log(window.process.argv);
window.openFile = (desc, fileTypes, multiple, type, folder) => {
  response = ipcRenderer.sendSync("openFile", {
    desc: desc, 
    fileTypes: fileTypes,
    multiple: multiple,
    folder: folder
  });
  if (response['success']) {
    console.log(response);
    
    if (response["value"]['canceled']) return 0;
    files[type] = response["value"];

  } else {
    console.error(response['error']);
  }
}

