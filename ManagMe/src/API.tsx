import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export type Story = {
  id: number;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "doing" | "done";
  ownerId: number;
  createdAt: string;
  tasks: Task[];
};

export type Task = {
  id: number;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "doing" | "done";
  storyId: number;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  assigneeId: number | null | undefined;
  estimatedTime: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  stories: Story[];
};

class ProjectAPI {
  private collectionRef = collection(db, "projects");

  async getAllProjects(): Promise<Project[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(doc => doc.data() as Project);
  }

  async getProjectById(id: number): Promise<Project | null> {
    const snapshot = await getDocs(this.collectionRef);
    const project = snapshot.docs.find(doc => doc.data().id === id);
    return project ? (project.data() as Project) : null;
  }

  async getProjectByName(name: string): Promise<Project | null> {
    const snapshot = await getDocs(this.collectionRef);
    const project = snapshot.docs.find(doc => doc.data().name === name);
    return project ? (project.data() as Project) : null;
  }

  async addProject(project: Project): Promise<Project> {
    const existing = await this.getProjectByName(project.name);
    if (existing) throw new Error(`Projekt o nazwie "${project.name}" już istnieje.`);
    await setDoc(doc(this.collectionRef, project.id.toString()), project);
    return project;
  }

  async deleteProject(name: string): Promise<void> {
    const snapshot = await getDocs(this.collectionRef);
    const projectDoc = snapshot.docs.find(doc => doc.data().name === name);
    if (projectDoc) {
      await deleteDoc(doc(this.collectionRef, projectDoc.id));
    }
  }

  async updateProject(updatedProject: Project): Promise<Project | null> {
    const docRef = doc(this.collectionRef, updatedProject.id.toString());
    await setDoc(docRef, updatedProject);
    return updatedProject;
  }

  async addStoryToProject(projectName: string, story: Story): Promise<Project | null> {
    const snapshot = await getDocs(this.collectionRef);
    const projectDoc = snapshot.docs.find(doc => doc.data().name === projectName);

    if (!projectDoc) return null;

    const project = projectDoc.data() as Project;
    project.stories.push(story);

    await updateDoc(doc(this.collectionRef, projectDoc.id), { stories: project.stories });
    return project;
  }

  async getAllStories(): Promise<Story[]> {
    const projects = await this.getAllProjects();
    return projects.flatMap(project => project.stories);
  }

  async getStoryById(id: number): Promise<Story | null> {
    const stories = await this.getAllStories();
    return stories.find(s => s.id === id) || null;
  }

  async removeStoryById(storyId: number): Promise<Project | null> {
    const projects = await this.getAllProjects();

    for (const project of projects) {
      const originalLength = project.stories.length;
      project.stories = project.stories.filter(story => story.id !== storyId);

      if (project.stories.length !== originalLength) {
        await updateDoc(doc(this.collectionRef, project.id.toString()), { stories: project.stories });
        return project;
      }
    }

    return null;
  }

  async editStory(updatedStory: Story): Promise<Story | null> {
    const projects = await this.getAllProjects();

    for (const project of projects) {
      const storyIndex = project.stories.findIndex(s => s.id === updatedStory.id);
      if (storyIndex !== -1) {
        project.stories[storyIndex] = updatedStory;
        await updateDoc(doc(this.collectionRef, project.id.toString()), { stories: project.stories });
        return updatedStory;
      }
    }

    return null;
  }
  

async addTaskToStory(storyId: number, task: Task): Promise<Task | null> {
  const story = await this.getStoryById(storyId);
  if (!story) return null;

  story.tasks.push(task);


  story.tasks = story.tasks.map(t => {
    const entries = Object.entries(t).filter(([_, v]) => v !== undefined && v !== null);
    return Object.fromEntries(entries) as Task;
  });

  await this.editStory(story);
  return task;
}


  async updateTask(updatedTask: Task): Promise<Task | null> {
    const story = await this.getStoryById(updatedTask.storyId);
    if (!story) return null;

    const index = story.tasks.findIndex(t => t.id === updatedTask.id);
    if (index === -1) return null;

    story.tasks[index] = updatedTask;
    await this.editStory(story);
    return updatedTask;
  }

  async deleteTask(storyId: number, taskId: number): Promise<boolean> {
    const story = await this.getStoryById(storyId);
    if (!story) return false;

    const originalLength = story.tasks.length;
    story.tasks = story.tasks.filter(task => task.id !== taskId);
    await this.editStory(story);

    return story.tasks.length < originalLength;
  }

  async editTaskInStory(storyId: number, taskId: number, updatedFields: Partial<Task>): Promise<Task | null> {
    const story = await this.getStoryById(storyId);
    if (!story) return null;

    const index = story.tasks.findIndex(t => t.id === taskId);
    if (index === -1) return null;

    const updatedTask = { ...story.tasks[index], ...updatedFields };
    story.tasks[index] = updatedTask;
    await this.editStory(story);

    return updatedTask;
  }
}

export default ProjectAPI;