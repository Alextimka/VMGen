const openFile = (desc, fileTypes) => {
  response = ipcRenderer.sendSync("selectFile", {
    desc: desc, 
    fileTypes: fileTypes
  });
  if (response['success']) {
    if (response['canceled']) return 0;
    files[fileTypes[0]] = response[filePaths][0];
    console.log(files);
  } else {
    console.error(response['error']);
    
  }
}
module.exports.openFile = openFile;
