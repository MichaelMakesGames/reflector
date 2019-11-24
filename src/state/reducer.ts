import { Action, RawState } from "~/types";
import "./handlers";
import initialState from "./initialState";
import wrapState from "./wrapState";

export default function reducer(
  state: RawState = initialState,
  action: Action,
): RawState {
  const wrappedState = wrapState(state);
  wrappedState.handle(action);
  return wrappedState.raw;
}
