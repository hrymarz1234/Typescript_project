import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Project } from "./Objects";

function App() {
  
  return (
    <>
      <h1>Create new project</h1>
      <p>
        <label>name</label>
        <input type="text" id="name"></input>
      </p>
      <p>
        <label>description</label>
        <textarea id="description"></textarea>
      </p>
      <button onClick={CreateProject}>Add</button>
    </>
  );
}
let xpp = [] as Project[];
// n
if(localStorage.getItem("tab")!= null){
  const xd = localStorage.getItem("tab")
  xpp = JSON.parse(xd!);
 }
 
  
  function CreateProject() {
    console.log("byleco")
    let proj: Project = {
      id: Date.now(),
      name: (document.querySelector("#name") as HTMLInputElement).value,
      description: (document.querySelector("#description") as HTMLInputElement)
        .value,
    }
    console.log(proj)
    xpp.push(proj)
    localStorage.setItem("tab", JSON.stringify(xpp));
  }

export default App;
