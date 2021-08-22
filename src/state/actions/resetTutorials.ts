import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const resetTutorials = createAction("RESET_TUTORIALS")();
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
