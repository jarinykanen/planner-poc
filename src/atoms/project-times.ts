import { atomWithStorage } from "jotai/utils";
import { ProjectTime } from "../types";

export const projectTimesAtom = atomWithStorage<ProjectTime[]>("projectTimes", []);