import { set, get } from "idb-keyval";
import { GameState } from "~types";

export function save(state: GameState): void {
  set("save", state);
}

export function load(): Promise<GameState | undefined> {
  return get("save");
}
