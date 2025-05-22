import { Story } from "../API";

const KanbanBoard = ({ story }: { story: Story }) => {
  const statuses: ("todo" | "doing" | "done")[] = ["todo", "doing", "done"];

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {statuses.map(status => (
        <div key={status} style={{ flex: 1 }}>
          <h3>{status.toUpperCase()}</h3>
          {story.tasks
            .filter(task => task.status === status)
            .map(task => (
              <div key={task.id} style={{ border: "1px solid #ccc", margin: "1rem 0", padding: "1rem" }}>
                <strong>{task.name}</strong>
                <p>{task.description}</p>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;