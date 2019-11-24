import { VICTORY_POPULATION } from "~constants";
import WrappedState from "~types/WrappedState";

export default function processGameOver(state: WrappedState): void {
  const player = state.select.player();
  const population = state.select.population();
  if (!player || state.raw.morale <= 0 || population <= 0) {
    state.setRaw({
      ...state.raw,
      gameOver: true,
      victory: false,
    });
  } else if (population >= VICTORY_POPULATION) {
    state.setRaw({
      ...state.raw,
      gameOver: true,
      victory: true,
    });
  }
}
