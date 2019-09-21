import * as selectors from "~/state/selectors";
import { GameState } from "~/types";

export default function processGameOver(state: GameState): GameState {
  let newState = state;
  const player = selectors.player(newState);
  if (!player) {
    newState = {
      ...newState,
      gameOver: true,
    };
  }
  return newState;
}
