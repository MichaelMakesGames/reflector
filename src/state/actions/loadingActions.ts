import { createStandardAction } from "typesafe-actions";
import { GameState } from "~types";

export const newGame = createStandardAction("NEW_GAME")();
export const loadGame = createStandardAction("LOAD_GAME")<{
  state: GameState;
}>();
