import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectAPI, { Story } from "../API";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const api = new ProjectAPI();

const Task = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState("");
  const { currentUser } = useUser();
    

  useEffect(() => {
    if (storyId) {
      const foundStory = api.getStoryById(Number(storyId));
      setStory(foundStory);
    }
  }, [storyId]);

  const handleAddTask = (e: React.FormEvent) => {
    if (!currentUser || currentUser.role === "guest") {
  alert("Użytkownicy goście nie mogą dodawać zadań.");
  return;
}
    e.preventDefault();
    if (!story) return;

  const newTask = {
    id: Date.now(), 
    name: newTaskName,
    description: newTaskDescription,
    priority: newTaskPriority,
    estimatedTime: newTaskEstimatedTime,
    status: "todo" as "todo",
    storyId: story.id,
    assigneeId: undefined,
    startedAt: "",
    finishedAt: "",
    createdAt: new Date().toISOString(),
  };
 
  api.addTaskToStory(story.id, newTask); 
  setStory(api.getStoryById(story.id)); 

  console.log("Dodano zadanie:", newTask);
  console.log("Aktualna historia:", api.getStoryById(story.id));

  
  setNewTaskName("");
  setNewTaskDescription("");
  setNewTaskPriority("medium");
  setNewTaskEstimatedTime("");
};
 const handleDeleteTask = (taskId: number) => {
  if (!story) return;
  api.deleteTask(story.id, taskId); 
  setStory(api.getStoryById(story.id)); 
};


 return (
  <div style={{ padding: "2rem" }}>
    <h1>Witaj na stronie tasków!</h1>

    {story ? (
      <>
        <h2>{story.name}</h2>
        <p><strong>Status:</strong> {story.status}</p>
        <p><strong>Opis:</strong> {story.description}</p>

        <h3>Lista tasków:</h3>
        {story.tasks && story.tasks.length > 0 ? (
          <ul>
            {story.tasks.map(task => (
              <li key={task.id}>
                <strong>{task.name}</strong> - {task.status} - {task.priority}
                <button onClick={() => handleDeleteTask(task.id)}>Usuń</button>
                <button onClick={() => navigate(`/tasks/${story.id}/${task.id}`)}>
                  Szczegóły
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak tasków</p>
        )}

        {currentUser && currentUser.role !== "guest" && (
          <>
            <h3>Dodaj nowe zadanie</h3>
            <form onSubmit={handleAddTask}>
              <input 
                type="text" 
                placeholder="Nazwa zadania" 
                value={newTaskName} 
                onChange={e => setNewTaskName(e.target.value)} 
                required 
              />
              <textarea
                placeholder="Opis zadania"
                value={newTaskDescription}
                onChange={e => setNewTaskDescription(e.target.value)}
              />
              <select 
                value={newTaskPriority} 
                onChange={e => setNewTaskPriority(e.target.value as "low" | "medium" | "high")}
              >
                <option value="low">Niskie</option>
                <option value="medium">Średnie</option>
                <option value="high">Wysokie</option>
              </select>
              <input 
                type="text" 
                placeholder="Szacowany czas (np. 2h)" 
                value={newTaskEstimatedTime} 
                onChange={e => setNewTaskEstimatedTime(e.target.value)} 
              />
              <button type="submit">Dodaj zadanie</button>
            </form>
          </>
        )}

        {currentUser && currentUser.role === "guest" && (
          <p style={{ color: "gray" }}>
            Użytkownicy goście nie mogą dodawać nowych zadań.
          </p>
        )}
      </>
    ) : (
      <p>Nie znaleziono historyjki o ID {storyId}</p>
    )}
  </div>
);
};

export default Task;