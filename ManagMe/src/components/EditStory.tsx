import { useState } from "react";
import { Project, Story, Task } from "../API";
import ProjectAPI from "../API";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";

function EditStory() {
  const projectAPI = new ProjectAPI();
  const { storyId } = useParams();
   const { currentUser } = useUser();
  const navigate = useNavigate();

   if (!currentUser || currentUser.role === "guest") {
    return <p>Nie masz uprawnień do edycji tej historyjki.</p>;
  }
  if (!storyId) {
    return "";
  }

  const story = projectAPI.getStoryById(parseInt(storyId));
  if (!story) {
    return "";
  }
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(story.priority);
  const [status, setStatus] = useState<"todo" | "doing" | "done">(story.status);
  const [ownerId, setOwnerId] = useState(1);
  const [createdAt, setCreatedAt] = useState("");
  const [tasks, setTasks] = useState<Task[]>(story.tasks || []);


  function edit(): void {
    if (!story) {
      return;
    }
    if (!name.trim()) {
      alert("Nazwa historyjki nie może być pusta");
      return;
    }
    const newStory: Story = {
      id: story.id,
      name,
      description,
      priority,
      status,
      ownerId,
      createdAt,
      tasks,
    };
    projectAPI.editStory(newStory);
    navigate("/home");
  }
  return (
    <div>
      <h2>Edytuj historyjke</h2>
      <label>Nazwa:</label>
      <input
        type="text"
        defaultValue={story.name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Opis:</label>
      <textarea
        defaultValue={story.description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <label>Priorytet:</label>
          <select defaultValue={story.priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}>
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
          </select>
          <label>Status:</label>
          <select defaultValue={story.status} onChange={(e) => setStatus(e.target.value as "todo" | "doing" | "done")}>
            <option value="todo">Do zrobienia</option>
            <option value="doing">W trakcie</option>
            <option value="done">Zrobione</option>
          </select>
          <p></p>
        <button onClick={edit}>Edytuj historyjke</button>
      
    </div>
  );
}

export default EditStory;
