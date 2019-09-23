import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import { VICTORY_POPULATION } from "~constants";

export default function processGameOver(state: GameState): GameState {
  let newState = state;
  const player = selectors.player(newState);
  const population = selectors.population(newState);
  if (!player || newState.morale <= 0 || population <= 0) {
    newState = {
      ...newState,
      gameOver: true,
      victory: false,
    };
  } else if (population >= VICTORY_POPULATION) {
    newState = {
      ...newState,
      gameOver: true,
      victory: true,
    };
  }
  return newState;
}
