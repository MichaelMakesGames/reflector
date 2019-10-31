import { Action, GameState } from "~/types";
import handleAction from "./handleAction";
import "./handlers";
import initialState from "./initialState";

export default function reducer(
  state: GameState = initialState,
  action: Action,
): GameState {
  return handleAction(state, action);
}
