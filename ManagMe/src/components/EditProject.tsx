import { useState, useEffect } from "react";
import { Project } from "../API";
import { useUser } from "../context/UserContext";
import ProjectAPI from "../API";
import { useNavigate, useParams } from "react-router-dom";

function EditProject() {
  const projectAPI = new ProjectAPI();
  const { projectId } = useParams();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      const p = await projectAPI.getProjectById(parseInt(projectId));
      if (p) {
        setProject(p);
        setName(p.name);
        setDescription(p.description);
      }
    };
    fetchProject();
  }, [projectId]);

  if (!currentUser || currentUser.role === "guest") {
    return <p>Nie masz uprawnień do edycji tego projektu.</p>;
  }

  if (!project) {
    return <p>Ładowanie projektu...</p>;
  }

  function edit(): void {
    
     if (!project) {
    return;
  }
    if (!name.trim()) {
      alert("Nazwa projektu nie może być pusta");
      return;
    }
    const newProject: Project = {
      ...project,
      name,
      description,
      stories: project.stories || [],
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
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Opis:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <p></p>
      <button onClick={edit}>Edytuj projekt</button>
    </div>
  );
}

export default EditProject;