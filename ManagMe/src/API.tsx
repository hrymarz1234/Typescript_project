export type Project = {
  id: number;
  name: string;
  description: string;
};

class ProjectAPI {
  private storageKey: string;

  constructor(storageKey: string = 'projects') {
      this.storageKey = storageKey;
  }

  // Pobiera wszystkie projekty
  getAllProjects(): Project[] {
      const projects = localStorage.getItem(this.storageKey);
      return projects ? JSON.parse(projects) : [];
  }

  // Pobiera projekt po nazwie
  getProjectByName(name: string): Project | null {
      const projects = this.getAllProjects();
      return projects.find(project => project.name === name) || null;
  }

  // Dodaje nowy projekt
  addProject(project: Project): Project {
      const projects = this.getAllProjects();
      if (this.getProjectByName(project.name)) {
          throw new Error(`Projekt o nazwie "${project.name}" już istnieje.`);
      }
      projects.push(project);
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return project;
  }

  // Aktualizuje projekt po nazwie
  updateProject(name: string, updatedProject: Partial<Project>): Project | null {
      let projects = this.getAllProjects();
      let updated = null;
      projects = projects.map(project => {
          if (project.name === name) {
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

  // Usuwa projekt po nazwie
  deleteProject(name: string): void {
      let projects = this.getAllProjects();
      projects = projects.filter(project => project.name !== name);
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }
}

export default ProjectAPI;
