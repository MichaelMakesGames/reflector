import { set, get } from "idb-keyval";
import { RawState } from "~types";

export function save(state: RawState): void {
  set("save", state);
}

export function load(): Promise<RawState | undefined> {
  return get("save");
}
