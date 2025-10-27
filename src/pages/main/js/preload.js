const { contextBridge, ipcRenderer } = require('electron');

const files = {jsonField: [], xmlStructure: []};

contextBridge.exposeInMainWorld('projects', {
  openFile: (desc, fileTypes, multiple, type,folder) => {
    response = ipcRenderer.sendSync("openFile", {
      desc: desc, 
      fileTypes: fileTypes,
      multiple: multiple,
      folder: folder
    });
    if (response['success']) {
      if (response["value"]['canceled']) return 0;
      files[type] = response["value"];
    } else {
      console.error(response['error']);
    }
  },
  title: [],
  generate: () => {
    let jsonFile = JSON.parse(files["jsonField"]);
    let xmlFile = JSON.parse(ipcRenderer.sendSync("toJson", {xml: files["xmlStructure"].toString()})["value"]);
    console.log(jsonFile);
    console.log(xmlFile);

  }
});

// ipcRenderer.on("projectTitle", (event, args)=>{
//   projects.title = args["title"];
//   console.log(projects.title);
//   console.log(projects.title);
  
//   event.returnValue = {success: true};
// });