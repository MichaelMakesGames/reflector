import { createStandardAction } from "typesafe-actions";
import { RawState } from "~types";

export const newGame = createStandardAction("NEW_GAME")();
export const loadGame = createStandardAction("LOAD_GAME")<{
  state: RawState;
}>();
