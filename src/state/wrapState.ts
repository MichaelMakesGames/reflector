import selectors from "./selectors";
import actions from "./actions";
import { RawState, Action } from "~types";
import WrappedState from "~types/WrappedState";
import handleAction from "./handleAction";

export default function wrapState(state: RawState): WrappedState {
  const wrappedState: any = {
    raw: state,
    select: {},
    act: {},
  };
  wrappedState.setRaw = (newState: RawState) => {
    wrappedState.raw = newState;
    return wrappedState;
  };
  wrappedState.handle = (action: Action) => {
    handleAction(wrappedState, action);
    return wrappedState;
  };
  for (const [key, actionCreator] of Object.entries(actions)) {
    wrappedState.act[key] = (...args: any[]) =>
      wrappedState.handle((actionCreator as any)(...args));
  }
  for (const [key, selector] of Object.entries(selectors)) {
    wrappedState.select[key] = (...args: any[]) =>
      (selector as any)(wrappedState.raw, ...args);
  }
  return wrappedState;
}
