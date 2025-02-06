import { EventItem } from "react-big-schedule";

export interface Project {
  id?: string;
  name: string;
  start: Date;
  end: Date;
  workerIds: string[];
  phaseIds?: string[];
  plannedTotalHours: number;
  allocatedHours: number;
};

export interface Worker {
  id?: string;
  name: string;
  projects?: string[];
  color?: string;
}

export interface ProjectTime extends EventItem{
  projectId: string;
  workerId?: string;
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

export const demoPhases: Phase[] = [
  { id: "1", name: "Vaihe 1" },
  { id: "2", name: "Vaihe 2" },
  { id: "3", name: "Vaihe 3" },
  { id: "4", name: "Vaihe 4" },
  { id: "5", name: "Vaihe 5" },
  { id: "6", name: "Vaihe 6" },
  { id: "7", name: "Vaihe 7" },
  { id: "8", name: "Vaihe 8" },
  { id: "9", name: "Vaihe 9" },
  { id: "10", name: "Vaihe 10" },
  { id: "11", name: "Vaihe 11" },
  { id: "12", name: "Vaihe 12" },
  { id: "13", name: "Vaihe 13" },
  { id: "14", name: "Vaihe 14" }
];