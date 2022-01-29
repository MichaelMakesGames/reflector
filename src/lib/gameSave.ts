import * as idb from "idb-keyval";
import { MAX_TURNS_TO_SAVE } from "../constants";
import { RawState } from "../types";

export function save(state: RawState): void {
  const stateToSave: RawState = {
    ...state,
    isAutoMoving: false,
    entitiesByComp: {},
    entitiesByPosition: {},
  };
  idb
    .setMany([
      [`save-${state.time.turn}`, stateToSave],
      ["save-latest", stateToSave],
    ])
    .catch((e) => {
      console.error("save failed", e);
    })
    .then(() => idb.del(`save-${state.time.turn - MAX_TURNS_TO_SAVE}`))
    .catch((e) => {
      console.error("save deletion failed", e);
    });
}

export function load(
  saveName: string = "save-latest"
): Promise<RawState | undefined> {
  return idb.get(saveName).catch((e) => {
    // eslint-disable-next-line no-alert
    alert(
      "Failed to load the game. This may be because you are in private browsing or incognito mode. You may still play, but your progress will not be saved, and the undo feature will be unavailable."
    );
  });
}
