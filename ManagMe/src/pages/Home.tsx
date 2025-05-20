import { useState, useEffect } from "react";
import "./../App.css";
import { Project, Story } from "./../API";
import ProjectAPI from "./../API"; 
import { useNavigate } from "react-router-dom";
import { useUser } from "./../context/UserContext";

function Home() {
  const user = useUser();
  const projectAPI = new ProjectAPI();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [taskName, setStoryName] = useState("");
  const [taskDescription, setStoryDescription] = useState("");
  const [taskPriority, setStoryPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskStatus, setStoryStatus] = useState<"todo" | "doing" | "done">("todo");
  const [filterStatus, setFilterStatus] = useState<"all" | "todo" | "doing" | "done">("all");
  

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
    navigate(`/editProject/${project.id}`)
  }
  function setActiveStory(story: Story) {
    setCurrentStory(story);
  }
  function deleteStory(story: Story) {
    projectAPI.removeStoryById(story.id);
    setProjects(projectAPI.getAllProjects());
  }
  function editStory(story: Story) {
    navigate(`/editStory/${story.id}`)
  }

  function createProject() {
    if (!name.trim()) {
      alert("Nazwa projektu nie może być pusta");
      return;
    }

    const newProject: Project = { id: Date.now(), name, description, stories: [] };
    projectAPI.addProject(newProject);
    setProjects([...projects, newProject]);
    setName("");
    setDescription("");
  }

  function addStoryToProject() {
    if (!currentProject) return;

    const newStory: Story = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      priority: taskPriority,
      status: taskStatus,
      ownerId: 1, 
      createdAt: new Date().toISOString(),
    };

    const updatedProject = projectAPI.addStoryToProject(currentProject.name, newStory);

    if (updatedProject) {
      setProjects(projectAPI.getAllProjects());
      setCurrentProject(updatedProject);
      setStoryName("");
      setStoryDescription("");
      setStoryPriority("medium");
      setStoryStatus("todo");
    }
  }
  return (
    <div>
      <h1>Zarządzanie projektami</h1>
      <h3>Zalogowany: {user.firstName} {user.lastName}</h3>
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

          <h3>Dodaj Historyjke</h3>
          <label>Nazwa Historyjki:</label>
          <input type="text" value={taskName} onChange={(e) => setStoryName(e.target.value)} />
          <label>Opis Historyjki:</label>
          <textarea value={taskDescription} onChange={(e) => setStoryDescription(e.target.value)} />
          <label>Priorytet:</label>
          <select value={taskPriority} onChange={(e) => setStoryPriority(e.target.value as "low" | "medium" | "high")}>
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
          </select>
          <label>Status:</label>
          <select value={taskStatus} onChange={(e) => setStoryStatus(e.target.value as "todo" | "doing" | "done")}>
            <option value="todo">Do zrobienia</option>
            <option value="doing">W trakcie</option>
            <option value="done">Zrobione</option>
          </select>
          <button onClick={addStoryToProject}>Dodaj Historyjke</button>

          <div>
            <label>Filtruj według statusu: </label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
              <option value="all">Wszystkie</option>
              <option value="todo">Do zrobienia</option>
              <option value="doing">W trakcie</option>
              <option value="done">Zrobione</option>
            </select>
          </div>

          <h3>Lista zadań:</h3>
          {currentProject.stories.length === 0 ? (
            <p>Brak zadań</p>
          ) : (
            <ul>
              {currentProject.stories
                .filter((story) => filterStatus === "all" || story.status === filterStatus)
                .map((story) => (
                  <li key={story.id}>
                    <strong>{story.name}</strong> - {story.status} - {story.priority}
                    <button onClick={() => setActiveStory(story)}>Wybierz</button>
                    <button className="editbutton" onClick={() => editStory(story)}>Edytuj</button>
                    <button onClick={() => deleteStory(story)}>Usuń</button>
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

export default Home;