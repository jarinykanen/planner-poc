import { atomWithStorage } from "jotai/utils";
import { Worker } from "../types";

export const workersAtom = atomWithStorage<Worker[]>("workers", []);