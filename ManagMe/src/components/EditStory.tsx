import { useState, useEffect } from "react";
import { Story, Task } from "../API";
import ProjectAPI from "../API";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";

function EditStory() {
  const projectAPI = new ProjectAPI();
  const { storyId } = useParams();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const [story, setStory] = useState<Story | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");
  const [ownerId, setOwnerId] = useState(1);
  const [createdAt, setCreatedAt] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!storyId) return;

    async function fetchStory() {
      const id = parseInt(storyId!);
      const result = await projectAPI.getStoryById(id);
      if (result) {
        setStory(result);
        setName(result.name);
        setDescription(result.description);
        setPriority(result.priority);
        setStatus(result.status);
        setOwnerId(result.ownerId);
        setCreatedAt(result.createdAt);
        setTasks(result.tasks || []);
      }
    }

    fetchStory();
  }, [storyId]);

  function edit(): void {
    if (!story) return;

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
      <h2>Edytuj historyjkę</h2>
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
      <label>Priorytet:</label>
      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as "low" | "medium" | "high")
        }
      >
        <option value="low">Niski</option>
        <option value="medium">Średni</option>
        <option value="high">Wysoki</option>
      </select>
      <label>Status:</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "todo" | "doing" | "done")}
      >
        <option value="todo">Do zrobienia</option>
        <option value="doing">W trakcie</option>
        <option value="done">Zrobione</option>
      </select>
      <p></p>
      <button onClick={edit}>Edytuj historyjkę</button>
    </div>
  );
}

export default EditStory;