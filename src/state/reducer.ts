import { getType } from "typesafe-actions";
import { Action, RawState } from "~/types";
import actions from "./actions";
import "./handlers";
import { createInitialState } from "./initialState";
import wrapState from "./wrapState";

const GAME_OVER_ALLOW_LIST: string[] = [
  getType(actions.newGame),
  getType(actions.undoTurn),
  getType(actions.continueVictory),
];

export default function reducer(
  state: RawState = createInitialState(),
  action: Action,
): RawState {
  const wrappedState = wrapState(state);
  if (state.gameOver && !GAME_OVER_ALLOW_LIST.includes(action.type)) {
    return state;
  }
  wrappedState.handle(action);
  return wrappedState.raw;
}
