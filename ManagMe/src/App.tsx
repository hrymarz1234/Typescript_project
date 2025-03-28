import { useState, useEffect } from "react";
import "./App.css";
import { Project, Task } from "./API";
import ProjectAPI from "./API"; 

const projectAPI = new ProjectAPI();

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskStatus, setTaskStatus] = useState<"todo" | "doing" | "done">("todo");

  useEffect(() => {
    setProjects(projectAPI.getAllProjects());
  }, []);

  function setActiveProject(project: Project) {
    setCurrentProject(project);
  }
  function deleteProject(project: Project) {
    projectAPI.deleteProject(project.name);
    setProjects(projectAPI.getAllProjects());
  }
  function editProject(project: Project) {
    projectAPI.updateProject(project);
  }

  function createProject() {
    if (!name.trim()) {
      alert("Nazwa projektu nie może być pusta");
      return;
    }

    const newProject: Project = { id: Date.now(), name, description, tasks: [] };
    projectAPI.addProject(newProject);
    setProjects([...projects, newProject]);
    setName("");
    setDescription("");
  }

  function addTaskToProject() {
    if (!currentProject) return;

    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      priority: taskPriority,
      status: taskStatus,
      ownerId: 1, 
      createdAt: new Date().toISOString(),
    };

    const updatedProject = projectAPI.addTaskToProject(currentProject.name, newTask);

    if (updatedProject) {
      setProjects(projectAPI.getAllProjects());
      setCurrentProject(updatedProject);
      setTaskName("");
      setTaskDescription("");
      setTaskPriority("medium");
      setTaskStatus("todo");
    }
  }

  return (
    <div>
      <h1>Zarządzanie projektami</h1>

      <div>
        <h2>Wybierz projekt</h2>
        {projects.length === 0 ? (
          <p>Brak projektów</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <strong>{project.name}</strong>: {project.description}
                <button onClick={() => setActiveProject(project)}>Wybierz</button>
                <button className="editbutton" onClick={() => editProject(project)}>Edytuj</button>
                <button onClick={() => deleteProject(project)}>Usun</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {currentProject && (
        <div>
          <h2>Aktualny projekt: {currentProject.name}</h2>

          <h3>Dodaj zadanie</h3>
          <label>Nazwa zadania:</label>
          <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          <label>Opis zadania:</label>
          <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
          <label>Priorytet:</label>
          <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as "low" | "medium" | "high")}>
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
          </select>
          <label>Status:</label>
          <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value as "todo" | "doing" | "done")}>
            <option value="todo">Do zrobienia</option>
            <option value="doing">W trakcie</option>
            <option value="done">Zrobione</option>
          </select>
          <button onClick={addTaskToProject}>Dodaj zadanie</button>

          <h3>Lista zadań:</h3>
          {currentProject.tasks.length === 0 ? (
            <p>Brak zadań</p>
          ) : (
            <ul>
              {currentProject.tasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.name}</strong> - {task.status} - {task.priority}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <h2>Dodaj projekt</h2>
        <label>Nazwa:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Opis:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <p></p>
        <button onClick={createProject}>Utwórz projekt</button>
      </div>
    </div>
  );
}

export default App;