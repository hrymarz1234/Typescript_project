import { useState, useEffect } from "react";
import "./App.css";
import { Project } from "./Objects";
import ProjectAPI from "./API"; 

const projectAPI = new ProjectAPI();

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(projectAPI.getAllProjects()); 
  }, []);

  function createProject() {
    if (!name.trim()) {
      alert("Nazwa projektu nie może być pusta");
      return;
    }

    try {
      const newProject: Project = { id: Date.now(), name, description };
      projectAPI.addProject(newProject);
      setProjects([...projects, newProject]); 
      setName(""); 
      setDescription("");
    } catch (error) {
      alert(error);
    }
  }

  function deleteProject(name: string) {
    projectAPI.deleteProject(name);
    setProjects(projects.filter(p => p.name !== name)); 
  }

  function startEditing(project: Project) {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description);
  }

  function saveEditedProject() {
    if (!editingProject) return;

    const updatedProject: Project = { id: editingProject.id, name, description };
    projectAPI.updateProject(editingProject.name, updatedProject);

    setProjects(projects.map(p => (p.name === editingProject.name ? updatedProject : p)));
    setEditingProject(null);
    setName("");
    setDescription("");
  }

  return (
    <div>
      <h1>Zarządzanie projektami</h1>

      <h2>{editingProject ? "Edytuj projekt" : "Utwórz nowy projekt"}</h2>
      <label>Nazwa:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>Opis:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <p></p>
      
      {editingProject ? (
        <>
          <button onClick={saveEditedProject}>Zapisz</button>
          <button onClick={() => setEditingProject(null)}>Anuluj</button>
        </>
      ) : (
        <button onClick={createProject}>Dodaj projekt</button>
      )}

      <h2>Lista projektów</h2>
      {projects.length === 0 ? (
        <p>Brak projektów</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong>: {project.description}
              <button onClick={() => startEditing(project)}>Edytuj</button>
              <button onClick={() => deleteProject(project.name)}>Usuń</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;