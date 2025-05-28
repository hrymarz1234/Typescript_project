import { useState } from "react";
import { Project } from "../API";
import { useUser } from "../context/UserContext";
import ProjectAPI from "../API";
import { useNavigate, useParams } from "react-router-dom";

function EditProject() {
  const projectAPI = new ProjectAPI();
  const { projectId } = useParams();
  const { currentUser } = useUser();
  const navigate = useNavigate();

    if (!currentUser || currentUser.role === "guest") {
    return <p>Nie masz uprawnień do edycji tego projektu.</p>;
  }

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
      stories: [],
    };
    projectAPI.updateProject(newProject);
    navigate("/home");
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
