import { Story } from "../API";

const KanbanBoard = ({ story }: { story: Story }) => {
  const statuses: ("todo" | "doing" | "done")[] = ["todo", "doing", "done"];

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {statuses.map(status => (
        <div key={status} style={{ flex: 1 }}>
          <h3>{status.toUpperCase()}</h3>
          {story.tasks?.filter(task => task.status === status).map(task => (
            <div
              key={task.id}
              style={{
                border: "1px solid #ccc",
                margin: "1rem 0",
                padding: "1rem",
                backgroundColor: "none",
                borderRadius: "8px"
              }}
            >
              <strong>{task.name}</strong>
              <p><em>{task.description}</em></p>
              <p><strong>Priorytet:</strong> {task.priority}</p>
              <p><strong>Szacowany czas:</strong> {task.estimatedTime}</p>
              <p><strong>Utworzono:</strong> {new Date(task.createdAt).toLocaleString()}</p>
              {task.startedAt && (
                <p><strong>Rozpoczęto:</strong> {new Date(task.startedAt).toLocaleString()}</p>
              )}
              {task.finishedAt && (
                <p><strong>Zakończono:</strong> {new Date(task.finishedAt).toLocaleString()}</p>
              )}
              {task.assigneeId !== undefined && (
                <p><strong>Przypisany użytkownik (ID):</strong> {task.assigneeId}</p>
              )}
            </div>
          )) || <p>Brak zadań</p>}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;