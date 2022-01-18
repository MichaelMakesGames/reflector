import * as idb from "idb-keyval";
import { RawState } from "../types";

export function save(state: RawState): void {
  idb.setMany([
    [`save-${state.time.turn}`, state],
    ["save-latest", state],
  ]);
}

export function load(
  saveName: string = "save-latest"
): Promise<RawState | undefined> {
  return idb.get(saveName);
}
