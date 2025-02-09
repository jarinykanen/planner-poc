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
  workspaceId: string;
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
  id?: string;
  name: string;
}

export interface Workspace {
  id?: string;
  name: string;
}