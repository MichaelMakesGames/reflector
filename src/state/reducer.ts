import { getType } from "typesafe-actions";
import { Action, RawState } from "~/types";
import actions from "./actions";
import "./handlers";
import initialState from "./initialState";
import wrapState from "./wrapState";

const START_OF_TURN_ALLOW_LIST: string[] = [
  getType(actions.undoTurn),
  getType(actions.moveCursor),
  getType(actions.setCursorPos),
];

const GAME_OVER_ALLOW_LIST: string[] = [
  getType(actions.newGame),
  getType(actions.undoTurn),
  getType(actions.continueVictory),
];

export default function reducer(
  state: RawState = initialState,
  action: Action,
): RawState {
  const wrappedState = wrapState(state);
  if (state.gameOver && !GAME_OVER_ALLOW_LIST.includes(action.type)) {
    return state;
  }
  if (state.isStartOfTurn && !START_OF_TURN_ALLOW_LIST.includes(action.type)) {
    wrappedState.setRaw({
      ...wrappedState.raw,
      isStartOfTurn: false,
    });
  }
  wrappedState.handle(action);
  return wrappedState.raw;
}
