import { useState, useEffect } from "react";
import "./../App.css";
import { Project, Story } from "./../API";
import ProjectAPI from "./../API";
import { useNavigate } from "react-router-dom";
import { AlUsers, useUser } from "./../context/UserContext";

function Home() {
  const alUsers = new AlUsers().getAllUsers();
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
    async function fetchProjects() {
      const allProjects = await projectAPI.getAllProjects();
      setProjects(allProjects);
    }
    fetchProjects();
  }, []);

  if (!currentUser || !alUsers) {
    return <p>Ładowanie danych użytkownika...</p>;
  }

  function setActiveProject(project: Project) {
    setCurrentProject(project);
  }

  async function deleteProject(project: Project) {
    if (!currentUser || currentUser.role === "guest") return;
    await projectAPI.deleteProject(project.name);
    const allProjects = await projectAPI.getAllProjects();
    setProjects(allProjects);
  }

  function editProject(project: Project) {
    navigate(`/editProject/${project.id}`);
  }

  function setActiveStory(story: Story) {
    setCurrentStory(story);
  }

  async function deleteStory(story: Story) {
    if (!currentUser || currentUser.role === "guest") return;
    await projectAPI.removeStoryById(story.id);
    const allProjects = await projectAPI.getAllProjects();
    setProjects(allProjects);
    const matched = allProjects.find(p => p.id === currentProject?.id);
    if (matched) {
      setCurrentProject(matched);
    } else {
      setCurrentProject(null);
    }
  }

  function editStory(story: Story) {
    navigate(`/editStory/${story.id}`);
  }

  async function createProject() {
    if (!currentUser || currentUser.role === "guest") return;
    if (!name.trim()) {
      alert("Nazwa projektu nie może być pusta");
      return;
    }
    const newProject: Project = { id: Date.now(), name, description, stories: [] };
    await projectAPI.addProject(newProject);
    const allProjects = await projectAPI.getAllProjects();
    setProjects(allProjects);
    setName("");
    setDescription("");
  }

  async function addStoryToProject() {
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

    const updatedProject = await projectAPI.addStoryToProject(currentProject.name, newStory);
    if (updatedProject) {
      const allProjects = await projectAPI.getAllProjects();
      setProjects(allProjects);
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
          <h3 className="py-2">Lista użytkowników:</h3>
          <ul>
            {alUsers.map((user) => (
              <li className="pb-2" key={user.id}>
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
            <div style={{ display: "flex", flexDirection: "column",gap: "8px",justifyContent: "center",alignItems: "center"}}>
              <h2 className="pt-2">Dodaj projekt</h2>
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
        <div style={{ display: "flex", flexDirection: "column",gap: "8px",justifyContent: "center",alignItems: "center"}}>
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