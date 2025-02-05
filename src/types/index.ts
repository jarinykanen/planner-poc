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

/**
 * Valmistelevat työt
 * Elementtityö
 * Pystytys
 * Listotus (sisäpuoli)
 * Ovien asennus ja listotus
 * Läpiviennit ja IV-varustelu
 * Sähkövarustelu ja johdotus
 * Sähkömittaus
 * Lisävarustelu ja kalustus
 * Siivous
 * Laatutarkastukset
 * Korjaukset
 * Suojaus ja kuormaus
 * Kuljetus ja asennus
 */
export const demoPhases: Phase[] = [
  { id: '1', name: 'Valmistelevat työt' },
  { id: '2', name: 'Elementtityö' },
  { id: '3', name: 'Pystytys' },
  { id: '4', name: 'Listotus (sisäpuoli)' },
  { id: '5', name: 'Ovien asennus ja listotus' },
  { id: '6', name: 'Läpiviennit ja IV-varustelu' },
  { id: '7', name: 'Sähkövarustelu ja johdotus' },
  { id: '8', name: 'Sähkömittaus' },
  { id: '9', name: 'Lisävarustelu ja kalustus' },
  { id: '10', name: 'Siivous' },
  { id: '11', name: 'Laatutarkastukset' },
  { id: '12', name: 'Korjaukset' },
  { id: '13', name: 'Suojaus ja kuormaus' },
  { id: '14', name: 'Kuljetus ja asennus' }
];