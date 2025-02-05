import { Project } from "../types";
import { atomWithStorage } from "jotai/utils";

export const projectsAtom = atomWithStorage<Project[]>("projects", []);