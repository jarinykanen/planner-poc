import { atomWithStorage } from "jotai/utils";
import { Phase } from "../types";

export const phasesAtom = atomWithStorage<Phase[]>("phases", []);