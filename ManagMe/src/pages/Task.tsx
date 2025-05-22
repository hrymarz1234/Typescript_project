import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectAPI, { Story, Task as TaskType } from "../API";

const api = new ProjectAPI();

const Task = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [story, setStory] = useState<Story | null>(null);
  
  useEffect(() => {
    if (storyId) {
      const found = api.getStoryById(Number(storyId));
      if (found) setStory(found);
    }
  }, [storyId]);

    return (
    <div style={{ padding: "2rem" }}>
      <h1>Witaj na stronie tasków!</h1>
      {story ? (
        <>
          <h2>{story.name}</h2>
          <p><strong>Status:</strong> {story.status}</p>
          <p><strong>Opis:</strong> {story.description}</p>

          <h3>Lista tasków:</h3>
          {story.tasks.length > 0 ? (
            <ul>
              {story.tasks.map(task => (
                <li key={task.id}>
                  <strong>{task.name}</strong> - {task.status} - {task.priority}
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak tasków</p>
          )}
        </>
      ) : (
        <p>Nie znaleziono historyjki o ID {storyId}</p>
      )}
    </div>
  );
};

export default Task;