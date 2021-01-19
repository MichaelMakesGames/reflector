import { set, get } from "idb-keyval";
import { RawState } from "~types";
import WrappedState from "~types/WrappedState";

export function save(state: RawState): void {
  set("save", state);
}

export function load(): Promise<RawState | undefined> {
  return get("save");
}

export function prepareStateAndSave(state: WrappedState) {
  state.setRaw({
    ...state.raw,
    startOfLastTurn: {
      ...(state.raw.startOfThisTurn || state.raw),
      startOfThisTurn: null,
      startOfLastTurn: null,
    },
  });
  state.setRaw({
    ...state.raw,
    startOfThisTurn: {
      ...state.raw,
      startOfThisTurn: null,
      startOfLastTurn: null,
    },
  });
  save(state.raw);
}
