import { VICTORY_POPULATION, VICTORY_ON_TURN } from "~constants";
import WrappedState from "~types/WrappedState";

export default function gameOverSystem(state: WrappedState): void {
  if (!state.select.player() || state.select.morale() <= 0) {
    state.setRaw({
      ...state.raw,
      gameOver: true,
      victory: false,
    });
  } else if (state.raw.time.turn >= VICTORY_ON_TURN && !state.raw.victory) {
    state.setRaw({
      ...state.raw,
      gameOver: true,
      victory: true,
    });
  }
}
