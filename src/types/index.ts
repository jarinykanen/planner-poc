export interface Project {
  id: string;
  name: string;
  start: Date;
  end: Date;
  peopleIds: string[];
  phaseIds?: string[];
};

export interface People {
  id: string;
  name: string;
  projects: string[];
  color: string;
}

export interface ProjectTime {
  id: string;
  projectId: string;
  start: Date;
  end: Date;
  personId: string;
  phaseId?: string;
};

export interface ProductionLine {
  id: string;
  name: string;
  projects: string[];
}

export interface Phase {
  id: string;
  name: string;
}

export const demoProjects: Project[] = [
  {
    id: "1",
    name: "Työnumero 1",
    start: new Date("2025-02-18 00:00:00"),
    end: new Date("2025-02-30 23:59:59"),
    peopleIds: ["1", "2"],
    phaseIds: ["1", "2", "3"],
  },
  {
    id: "2",
    name: "Työnumero 2",
    start: new Date("2025-02-18 00:00:00"),
    end: new Date("2025-02-30 23:59:59"),
    peopleIds: ["1", "3"],
    phaseIds: ["1", "2"],
  }
];

export const demoPeople: People[] = [
  {
    id: "1",
    name: "Matti",
    projects: ["1"],
    color: "#ff0000",
  },
  {
    id: "2",
    name: "Teppo",
    projects: ["1"],
    color: "green",
  },
  {
    id: "3",
    name: "Kalle",
    projects: ["2"],
    color: "#0000ff",
  }
];

export const demoProjectTimes: ProjectTime[] = [
  {
    id: "1",
    projectId: "1",
    start: new Date("2025-02-18 00:00:00"),
    end: new Date("2025-02-28 23:59:59"),
    personId: "1",
    phaseId: "1",
  },
  {
    id: "2",
    projectId: "1",
    start: new Date("2025-02-20 00:00:00"),
    end: new Date("2025-02-28 23:59:59"),
    personId: "2",
    phaseId: "2",
  },
  {
    id: "3",
    projectId: "2",
    start: new Date("2025-02-19 00:00:00"),
    end: new Date("2025-02-21 23:59:59"),
    personId: "1",
    phaseId: "1",
  },
  {
    id: "4",
    projectId: "2",
    start: new Date("2025-02-18 00:00:00"),
    end: new Date("2025-02-28 23:59:59"),
    personId: "2",
    phaseId: "2",
  },
  {
    id: "5",
    projectId: "2",
    start: new Date("2025-02-25 00:00:00"),
    end: new Date("2025-02-28 23:59:59"),
    personId: "3",
    phaseId: "1",
  },
]

export const demoProductionLines: ProductionLine[] = [
  {
    id: "1",
    name: "Linja 1",
    projects: ["1"],
  },
  {
    id: "2",
    name: "Linja 2",
    projects: ["2"],
  }
];

export const demoPhases: Phase[] = [
  {
    id: "1",
    name: "Vaihe 1",
  },
  {
    id: "2",
    name: "Vaihe 2",
  },
  {
    id: "3",
    name: "Vaihe 3",
  }
];