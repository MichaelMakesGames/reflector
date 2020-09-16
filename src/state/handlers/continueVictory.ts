import WrappedState from "~types/WrappedState";
import { registerHandler } from "~state/handleAction";
import actions from "~state/actions";

function continueVictory(state: WrappedState): void {
  if (state.raw.victory) {
    state.setRaw({
      ...state.raw,
      gameOver: false,
    });
  }
}

registerHandler(continueVictory, actions.continueVictory);
