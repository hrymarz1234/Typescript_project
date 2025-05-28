import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectAPI, { Task as TaskType } from "../API";
import { useUser } from "../context/UserContext";

const api = new ProjectAPI();

const EditTask = () => {
  const { storyId, taskId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [task, setTask] = useState<TaskType | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");
  const [estimatedTime, setEstimatedTime] = useState("");

  useEffect(() => {
    if (storyId && taskId) {
      const story = api.getStoryById(Number(storyId));
      const foundTask = story?.tasks.find(t => t.id === Number(taskId)) || null;
      if (foundTask) {
        setTask(foundTask);
        setName(foundTask.name);
        setDescription(foundTask.description);
        setPriority(foundTask.priority);
        setStatus(foundTask.status);
        setEstimatedTime(foundTask.estimatedTime);
      }
    }
  }, [storyId, taskId]);

  if (!currentUser || currentUser.role === "guest") {
    return <p>Nie masz uprawnień do edycji tego zadania.</p>;
  }

  if (!task || !storyId || !taskId) return <p>Nie znaleziono zadania</p>;

  const handleEdit = () => {
    const updatedFields: Partial<TaskType> = {
      name,
      description,
      priority,
      status,
      estimatedTime,
    };

    if (status === "doing" && !task.startedAt) {
      updatedFields.startedAt = new Date().toISOString();
    }


    if (status === "done" && !("endedAt" in task)) {
      updatedFields.finishedAt = new Date().toISOString();
    }

    api.editTaskInStory(Number(storyId), Number(taskId), updatedFields);
    navigate(`/tasks/${storyId}`);
  };

  return (
    <div>
      <h2>Edytuj zadanie</h2>
      <label>Nazwa:</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>Opis:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

      <label>Priorytet:</label>
      <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}>
        <option value="low">Niski</option>
        <option value="medium">Średni</option>
        <option value="high">Wysoki</option>
      </select>

      <label>Status:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value as "todo" | "doing" | "done")}>
        <option value="todo">Do zrobienia</option>
        <option value="doing">W trakcie</option>
        <option value="done">Zrobione</option>
      </select>

      <label>Szacowany czas:</label>
      <input value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />

      <button onClick={handleEdit}>Zapisz zmiany</button>
    </div>
  );
};

export default EditTask;