import { Action, GameState } from "~/types";
import { BASE_IMMIGRATION_RATE, STARTING_MORALE } from "~constants";
import handleAction from "./handleAction";
import "./handlers";

const initialState: GameState = {
  entities: {},
  entitiesByPosition: {},
  messageLog: [],
  gameOver: false,
  victory: false,
  turnsUntilNextImmigrant: BASE_IMMIGRATION_RATE,
  morale: STARTING_MORALE,
};

export default function reducer(
  state: GameState = initialState,
  action: Action,
): GameState {
  return handleAction(state, action);
}
