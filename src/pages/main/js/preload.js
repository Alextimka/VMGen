const { contextBridge, ipcRenderer } = require('electron');

const files = {jsonField: [], xmlStructure: [], jsonExamples: []};



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
      console.log(response);
      files[type] = response["value"];
      console.log(files);
      

    } else {
      console.error(response['error']);
      
    }
  },
  title: []
});

// ipcRenderer.on("projectTitle", (event, args)=>{
//   projects.title = args["title"];
//   console.log(projects.title);
//   console.log(projects.title);
  
//   event.returnValue = {success: true};
// });