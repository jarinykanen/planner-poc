import { atomWithStorage } from "jotai/utils";
import { Workspace } from "../types";

export const workspacesAtom = atomWithStorage<Workspace[]>("workspaces", []);