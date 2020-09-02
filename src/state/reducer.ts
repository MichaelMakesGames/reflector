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

export default function reducer(
  state: RawState = initialState,
  action: Action,
): RawState {
  const wrappedState = wrapState(state);
  if (state.isStartOfTurn && !START_OF_TURN_ALLOW_LIST.includes(action.type)) {
    wrappedState.setRaw({
      ...wrappedState.raw,
      isStartOfTurn: false,
    });
  }
  wrappedState.handle(action);
  return wrappedState.raw;
}
