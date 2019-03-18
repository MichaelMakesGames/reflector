import * as actions from "../actions";
import processors from "../processors";
import { GameState } from "../types";

export function playerTookTurn(
  state: GameState,
  action: ReturnType<typeof actions.playerTookTurn>,
): GameState {
  return processors.reduce((state, processor) => processor(state), state);
}
