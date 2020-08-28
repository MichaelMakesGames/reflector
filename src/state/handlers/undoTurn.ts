import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function undoTurn(
  state: WrappedState,
  action: ReturnType<typeof actions.undoTurn>,
) {
  if (state.raw.previousState) {
    state.act.loadGame({ state: state.raw.previousState });
  } else {
    state.act.logMessage({
      message: "Cannot undo any further.",
    });
  }
}

registerHandler(undoTurn, actions.undoTurn);
