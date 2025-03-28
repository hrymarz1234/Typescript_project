export type Task = {
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
    tasks: Task[];
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
  
    addTaskToProject(projectName: string, task: Task): Project | null {
        let projects = this.getAllProjects();
        let updatedProject = null;
  
        projects = projects.map(project => {
            if (project.name === projectName) {
                project.tasks.push(task);
                updatedProject = { ...project };
            }
            return project;
        });
  
        if (updatedProject) {
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
        }
        return updatedProject;
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