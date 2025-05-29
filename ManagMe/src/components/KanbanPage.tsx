import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectAPI, { Story } from "../API";
import KanbanBoard from "./KanbanBoard";

const KanbanPage = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const api = new ProjectAPI();

  useEffect(() => {
    const fetchStory = async () => {
      if (storyId) {
        const fetchedStory = await api.getStoryById(Number(storyId));
        setStory(fetchedStory);
      }
    };

    fetchStory();
  }, [storyId]);

  if (!story) return <p>Ładowanie lub nie znaleziono historii...</p>;

  return <KanbanBoard story={story} />;
};

export default KanbanPage;
