import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectAPI, { Task } from "../API";
import { AlUsers, useUser } from "../context/UserContext";

const TaskDetails = () => {
  const alUsers = new AlUsers().getAllUsers(); 
  const navigate = useNavigate();
  const { storyId, taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const api = new ProjectAPI();
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchTask = async () => {
      const story = await api.getStoryById(Number(storyId));
      const found = story?.tasks.find((t: Task) => t.id === Number(taskId)) || null;
      setTask(found);
    };
    fetchTask();
  }, [storyId, taskId]);

  const handleAssign = (userId: number) => {
    if (!task || !currentUser || currentUser.role === "guest") return;
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
    if (!task || !currentUser || currentUser.role === "guest" || !task.assigneeId) return;
    const updated = {
      ...task,
      status: "done" as const,
      finishedAt: new Date().toISOString()
    };
    api.updateTask(updated);
    setTask(updated);
  };

  if (!task) return <p>Nie znaleziono zadania</p>;

  const eligibleUsers = alUsers.filter(
    u => u.role === "developer" || u.role === "devops"
  );

  const assignee = alUsers.find(u => u.id === task.assigneeId);

  return (
    <div>
      <h2>{task.name}</h2>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Start: {task.startedAt || "Nie rozpoczęto"}</p>
      <p>Koniec: {task.finishedAt || "Nie zakończono"}</p>
      <p>
        Osoba:{" "}
        {assignee
          ? `${assignee.firstName} ${assignee.lastName}`
          : "Nieprzypisana"}
      </p>

      {currentUser?.role !== "guest" ? (
        <label>
          Przypisz osobę:
          <select
            value={task.assigneeId ?? ""}
            onChange={e => handleAssign(Number(e.target.value))}
          >
            <option value="">-- Wybierz osobę --</option>
            {eligibleUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.role})
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p style={{ color: "gray" }}>
          Użytkownicy goście nie mogą przypisywać osób do zadań.
        </p>
      )}

      <div style={{ marginTop: "1rem" }}>
        {currentUser?.role !== "guest" ? (
          task.assigneeId ? (
            <button onClick={markAsDone}>Oznacz jako zakończone</button>
          ) : (
            <p style={{ color: "gray" }}>
              Przypisz osobę, aby móc oznaczyć zadanie jako zakończone.
            </p>
          )
        ) : (
          <p style={{ color: "gray" }}>
            Użytkownicy goście nie mogą oznaczać zadań jako zakończone.
          </p>
        )}
        <button onClick={() => navigate(`/kanban/${storyId}`)}>
          Zobacz Kanban
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;