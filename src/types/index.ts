import { EventItem } from "react-big-schedule";

export interface Project {
  id?: string;
  name: string;
  start: Date;
  end: Date;
  workerIds: string[];
  phaseIds?: string[];
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
  {
    id: "1",
    name: "Elementtien valmistus",
  },
  {
    id: "2",
    name: "Pystytys ja listoitus",
  },
  {
    id: "3",
    name: "IV-varustelu",
  },
  {
    id: "4",
    name: "Sähkövarustelu",
  },
  {
    id: "5",
    name: "Lisävarustelu",
  },
  {
    id: "6",
    name: "Kalustus",
  },
  {
    id: "7",
    name: "Siivous",
  },
  {
    id: "8",
    name: "Sähkömittaus",
  },
  {
    id: "9",
    name: "Laatutarkastukset",
  },
  {
    id: "10",
    name: "Suojaus ja kuormaus",
  },
  {
    id: "11",
    name: "Kuljetus ja asennus",
  },
];