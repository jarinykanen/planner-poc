export interface Project {
  id: string;
  name: string;
  start: Date;
  end: Date;
  peopleIds: string[];
};

export interface People {
  id: string;
  name: string;
  projects: string[];
}

export interface ProductionLine {
  id: string;
  name: string;
  projects: string[];
}

export const demoProjects: Project[] = [
  {
    id: "1",
    name: "Työnumero 1",
    start: new Date(2025, 1, 1),
    end: new Date(2025, 14, 1),
    peopleIds: ["1", "2"],
  },
  {
    id: "2",
    name: "Työnumero 2",
    start: new Date(2025, 1, 1),
    end: new Date(2025, 14, 1),
    peopleIds: ["1", "3"],
  }
];

export const demoPeople: People[] = [
  {
    id: "1",
    name: "Matti",
    projects: ["1"],
  },
  {
    id: "2",
    name: "Teppo",
    projects: ["1"],
  },
  {
    id: "3",
    name: "Kalle",
    projects: ["2"],
  }
];

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