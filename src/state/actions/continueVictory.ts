import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const continueVictory = createAction("CONTINUE_VICTORY")();
export default continueVictory;

function continueVictoryHandler(state: WrappedState): void {
  if (state.raw.victory) {
    state.setRaw({
      ...state.raw,
      gameOver: false,
    });
  }
}

registerHandler(continueVictoryHandler, continueVictory);
