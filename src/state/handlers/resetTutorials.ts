import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function resetTutorials(state: WrappedState): void {
  state.setRaw({
    ...state.raw,
    tutorials: {
      active: [],
      completed: [],
    },
  });
  state.act.newGame();
}

registerHandler(resetTutorials, actions.resetTutorials);
