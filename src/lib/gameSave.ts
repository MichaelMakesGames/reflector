import * as idb from "idb-keyval";
import { MAX_TURNS_TO_SAVE } from "../constants";
import { RawState } from "../types";

export function save(state: RawState): void {
  idb.setMany([
    [`save-${state.time.turn}`, state],
    ["save-latest", state],
  ]);
  idb.del(`save-${state.time.turn - MAX_TURNS_TO_SAVE}`);
}

export function load(
  saveName: string = "save-latest"
): Promise<RawState | undefined> {
  return idb.get(saveName);
}
