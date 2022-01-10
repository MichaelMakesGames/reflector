import { RawState } from "../../types";

export function nothing(state: RawState) {
  return null;
}

export function isEmpty(state: RawState) {
  return Object.keys(state.entities).length === 0;
}
