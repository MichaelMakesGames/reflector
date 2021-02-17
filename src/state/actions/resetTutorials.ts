import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const resetTutorials = createStandardAction("RESET_TUTORIALS")();
export default resetTutorials;

function resetTutorialsHandler(state: WrappedState): void {
  state.setRaw({
    ...state.raw,
    tutorials: {
      active: [],
      completed: [],
    },
  });
  state.act.newGame();
}

registerHandler(resetTutorialsHandler, resetTutorials);
