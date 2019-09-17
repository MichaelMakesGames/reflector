import * as actions from "~/state/actions";
import processors from "~/state/processors";
import { GameState } from "~/types";

export function playerTookTurn(
  state: GameState,
  action: ReturnType<typeof actions.playerTookTurn>,
): GameState {
  return processors.reduce((state, processor) => processor(state), state);
}
