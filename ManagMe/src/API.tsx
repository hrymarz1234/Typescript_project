export type Story = {
    id: number;
    name: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "doing" | "done";
    ownerId: number;
    createdAt: string;
  };
  
  export type Project = {
    id: number;
    name: string;
    description: string;
    stories: Story[];
  };

  class ProjectAPI {
    private storageKey: string;
  
    constructor(storageKey: string = 'projects') {
        this.storageKey = storageKey;
    }
  
    getAllProjects(): Project[] {
        const projects = localStorage.getItem(this.storageKey);
        return projects ? JSON.parse(projects) : [];
    }
  
    getProjectByName(name: string): Project | null {
        const projects = this.getAllProjects();
        return projects.find(project => project.name === name) || null;
    }
    getProjectById(id: number): Project | null {
        const projects = this.getAllProjects();
        return projects.find(project => project.id === id) || null;
    }

    addProject(project: Project): Project {
        const projects = this.getAllProjects();
        if (this.getProjectByName(project.name)) {
            throw new Error(`Projekt o nazwie "${project.name}" już istnieje.`);
        }
        projects.push(project);
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
        return project;
    }
    getAllStories(): Story[] {
        const storedProjects = localStorage.getItem(this.storageKey);
        if (!storedProjects) {
            return [];
        }
    
        const projects = JSON.parse(storedProjects);
        const stories: Story[] = [];
    
        projects.forEach((project: Project) => {
            if (project.stories) {
                stories.push(...project.stories);
            }
        });
    
        return stories;
    }
    
    getStoryById(id: number): Story | null {
        const stories = this.getAllStories();
        return stories.find(story => story.id === id) || null;
    }
  
    addStoryToProject(projectName: string, story: Story): Project | null {
        let projects = this.getAllProjects();
        let updatedProject = null;
  
        projects = projects.map(project => {
            if (project.name === projectName) {
                project.stories.push(story);
                updatedProject = { ...project };
            }
            return project;
        });
  
        if (updatedProject) {
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
        }
        return updatedProject;
    }
    removeStoryById(storyId: number): Project | null {
        let projects = this.getAllProjects();
        let updatedProject = null;
    
        projects = projects.map(project => {
            const originalStories = project.stories;
            project.stories = project.stories.filter(story => story.id !== storyId);
    
            if (originalStories.length !== project.stories.length) {
                updatedProject = { ...project };
            }
            return project;
        });
    
        if (updatedProject) {
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
        }
        return updatedProject;
    }
    editStory(updatedStory: Story): Story | null {
        let projects = this.getAllProjects();
        let updatedStoryRef: Story | null = null;
    
        projects = projects.map(project => {
            project.stories = project.stories.map(story => {
                if (story.id === updatedStory.id) { 
                    updatedStoryRef = { ...story, ...updatedStory };
                    return updatedStoryRef;
                }
                return story;
            });
    
            return project;
        });
    
        if (updatedStoryRef) {
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
        }
    
        return updatedStoryRef;
    }
    
  
    updateProject(updatedProject: Project): Project | null {
        let projects = this.getAllProjects();
        let updated = null;
        projects = projects.map(project => {
            if (project.id === updatedProject.id) {
                updated = { ...project, ...updatedProject };
                return updated;
            }
            return project;
        });
        if (updated) {
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
        }
        return updated;
    }
  
    deleteProject(name: string): void {
        let projects = this.getAllProjects();
        projects = projects.filter(project => project.name !== name);
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
    }
  }
  
  export default ProjectAPI;