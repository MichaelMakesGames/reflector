import { ActionCreator, getType } from "typesafe-actions";
import { Action } from "~types";
import WrappedState from "~types/WrappedState";

type ActionHandler = (state: WrappedState, action: any) => void;

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
  state: WrappedState,
  action: Action,
): WrappedState {
  const handler = handlers[action.type];
  if (handler) {
    handler(state, action);
  }
  return state;
}
