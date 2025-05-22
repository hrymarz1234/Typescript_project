import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectAPI from "../API";
import { Task } from "../API"; 

const TaskDetails = () => {
  const { storyId, taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const api = new ProjectAPI();

  useEffect(() => {
    const story = api.getStoryById(Number(storyId));
    const found = story?.tasks.find(t => t.id === Number(taskId)) || null;
    setTask(found);
  }, [storyId, taskId]);

  const handleAssign = (userId: number) => {
    if (!task) return;
    const updated = {
      ...task,
      assigneeId: userId,
      status: "doing" as const,
      startedAt: new Date().toISOString()
    };
    api.updateTask(updated);
    setTask(updated);
  };

  const markAsDone = () => {
    if (!task) return;
    const updated = {
      ...task,
      status: "doing" as const,
      finishedAt: new Date().toISOString()
    };
    api.updateTask(updated);
    setTask(updated);
  };

  if (!task) return <p>Nie znaleziono zadania</p>;

  return (
    <div>
      <h2>{task.name}</h2>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Start: {task.startedAt || "Nie rozpoczęto"}</p>
      <p>Koniec: {task.finishedAt || "Nie zakończono"}</p>
      <p>Osoba: {task.assigneeId ?? "Nieprzypisana"}</p>
      <button onClick={() => handleAssign(2)}>Przypisz osobę (id=2)</button>
      <button onClick={markAsDone}>Oznacz jako zakończone</button>
    </div>
  );
};

export default TaskDetails;