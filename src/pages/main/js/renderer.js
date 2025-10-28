//document.title = window.projectTitle;
const projectNameInput = document.getElementById("projectName")
//projectNameInput.value = window.projectTitle
projectNameInput.oninput = (event) => {
  document.title = (event.target.value) ? event.target.value : "Безымянный";
}