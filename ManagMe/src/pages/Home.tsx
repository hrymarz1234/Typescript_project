import { useState, useEffect } from "react";
import "./../App.css";
import { Project, Story } from "./../API";
import ProjectAPI from "./../API"; 
import { useNavigate } from "react-router-dom";
import { useUser } from "./../context/UserContext";

function Home() {
  const { currentUser, allUsers } = useUser();
  const projectAPI = new ProjectAPI();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [storyName, setStoryName] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyPriority, setStoryPriority] = useState<"low" | "medium" | "high">("medium");
  const [storyStatus, setStoryStatus] = useState<"todo" | "doing" | "done">("todo");
  const [filterStatus, setFilterStatus] = useState<"all" | "todo" | "doing" | "done">("all");

  useEffect(() => {
    setProjects(projectAPI.getAllProjects());
  }, []);

  if (!currentUser || !allUsers) {
    return <p>Ładowanie danych użytkownika...</p>;
  }

  function setActiveProject(project: Project) {
    setCurrentProject(project);
  }

  function deleteProject(project: Project) {
    if (!currentUser || currentUser.role === "guest") return;
    projectAPI.deleteProject(project.name);
    setProjects(projectAPI.getAllProjects());
  }

  function editProject(project: Project) {
    navigate(`/editProject/${project.id}`);
  }

  function setActiveStory(story: Story) {
    setCurrentStory(story);
  }

  function deleteStory(story: Story) {
    if (!currentUser || currentUser.role === "guest") return;
    projectAPI.removeStoryById(story.id);
    setProjects(projectAPI.getAllProjects());
  }

  function editStory(story: Story) {
    navigate(`/editStory/${story.id}`);
  }

  function createProject() {
    if (!currentUser || currentUser.role === "guest") return;
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
    if (!currentUser || currentUser.role === "guest" || !currentProject) return;

    const newStory: Story = {
      id: Date.now(),
      name: storyName,
      description: storyDescription,
      priority: storyPriority,
      status: storyStatus,
      ownerId: currentUser.id,
      createdAt: new Date().toISOString(),
      tasks: [],
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

      {!currentProject && (
        <>
          <h3>Lista użytkowników:</h3>
          <ul>
            {allUsers.map((user) => (
              <li key={user.id}>
                {user.firstName} {user.lastName} - {user.role}
              </li>
            ))}
          </ul>

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
                    {currentUser.role !== "guest" && (
                      <>
                        <button className="editbutton" onClick={() => editProject(project)}>
                          Edytuj
                        </button>
                        <button onClick={() => deleteProject(project)}>Usuń</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {currentUser.role !== "guest" && (
            <div>
              <h2>Dodaj projekt</h2>
              <label>Nazwa:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <label>Opis:</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              <button onClick={createProject}>Utwórz projekt</button>
            </div>
          )}
        </>
      )}

      {currentProject && (
        <div>
          <h2>Aktualny projekt: {currentProject.name}</h2>

          {currentUser.role !== "guest" && (
            <>
              <h3>Dodaj Historyjkę</h3>
              <label>Nazwa Historyjki:</label>
              <input
                type="text"
                value={storyName}
                onChange={(e) => setStoryName(e.target.value)}
              />
              <label>Opis Historyjki:</label>
              <textarea
                value={storyDescription}
                onChange={(e) => setStoryDescription(e.target.value)}
              />
              <label>Priorytet:</label>
              <select
                value={storyPriority}
                onChange={(e) => setStoryPriority(e.target.value as "low" | "medium" | "high")}
              >
                <option value="low">Niski</option>
                <option value="medium">Średni</option>
                <option value="high">Wysoki</option>
              </select>
              <label>Status:</label>
              <select
                value={storyStatus}
                onChange={(e) => setStoryStatus(e.target.value as "todo" | "doing" | "done")}
              >
                <option value="todo">Do zrobienia</option>
                <option value="doing">W trakcie</option>
                <option value="done">Zrobione</option>
              </select>
              <button onClick={addStoryToProject}>Dodaj Historyjkę</button>
            </>
          )}

          <div>
            <label>Filtruj według statusu: </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">Wszystkie</option>
              <option value="todo">Do zrobienia</option>
              <option value="doing">W trakcie</option>
              <option value="done">Zrobione</option>
            </select>
          </div>

          <h3>Lista historyjek:</h3>
          {currentProject.stories.length === 0 ? (
            <p>Brak historyjek</p>
          ) : (
            <ul>
              {currentProject.stories
                .filter((story) => filterStatus === "all" || story.status === filterStatus)
                .map((story) => (
                  <li key={story.id}>
                    <strong>{story.name}</strong> - {story.status} - {story.priority}
                    <button
                      className="selectbutton"
                      onClick={() => navigate(`/task/${story.id}`)}
                    >
                      Wybierz
                    </button>
                    {currentUser.role !== "guest" && (
                      <>
                        <button className="editbutton" onClick={() => editStory(story)}>
                          Edytuj
                        </button>
                        <button onClick={() => deleteStory(story)}>Usuń</button>
                      </>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
