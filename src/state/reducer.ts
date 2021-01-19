import { getType } from "typesafe-actions";
import { Action, RawState } from "~/types";
import actions from "./actions";
import "./handlers";
import { createInitialState } from "./initialState";
import processTutorials from "./processors/processTutorials";
import wrapState from "./wrapState";

const GAME_OVER_ALLOW_LIST: string[] = [
  getType(actions.newGame),
  getType(actions.undoTurn),
  getType(actions.continueVictory),
];

const AUTO_MOVE_ALLOW_LIST: string[] = [
  getType(actions.autoMove),
  getType(actions.setCursorPos),
];

export default function reducer(
  state: RawState = createInitialState({ completedTutorials: [] }),
  action: Action,
): RawState {
  const wrappedState = wrapState(state);

  if (state.gameOver && !GAME_OVER_ALLOW_LIST.includes(action.type)) {
    return state;
  }

  if (state.isAutoMoving && !AUTO_MOVE_ALLOW_LIST.includes(action.type)) {
    wrappedState.act.cancelAutoMove();
    return wrappedState.raw;
  }

  wrappedState.handle(action);

  processTutorials(wrapState(state), wrappedState, action);

  return wrappedState.raw;
}
