import { ActionCreator, getType } from "typesafe-actions";
import { Action, GameState } from "~types";

type ActionHandler = (state: GameState, action: any) => GameState;

const handlers: {
  [type: string]: ActionHandler;
} = {};

export function registerHandler(
  handler: ActionHandler,
  actionCreator: ActionCreator<string>,
) {
  handlers[getType(actionCreator)] = handler;
}

export default function handleAction(
  state: GameState,
  action: Action,
): GameState {
  const handler = handlers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
}
