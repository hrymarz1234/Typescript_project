import { useState } from "react";
import { Project } from "../API";
import ProjectAPI from "../API";
import { useNavigate, useParams } from "react-router-dom";

function EditProject() {
  const projectAPI = new ProjectAPI();
  const { projectId } = useParams();
  const navigate = useNavigate();
  if (!projectId) {
    return "";
  }

  const project = projectAPI.getProjectById(parseInt(projectId));
  if (!project) {
    return "";
  }
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  function edit(): void {
    if (!project) {
      return;
    }
    if (!name.trim()) {
      alert("Nazwa projektu nie może być pusta");
      return;
    }
    const newProject: Project = {
      id: project.id,
      name,
      description,
      tasks: [],
    };
    projectAPI.updateProject(newProject);
    navigate("/");
  }
  return (
    <div>
      <h2>Edytuj projekt</h2>
      <label>Nazwa:</label>
      <input
        type="text"
        defaultValue={project.name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Opis:</label>
      <textarea
        defaultValue={project.description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <p></p>
      <button onClick={edit}>Edytuj projekt</button>
    </div>
  );
}

export default EditProject;
