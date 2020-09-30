import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { RawState } from "~types";

function undoTurn(
  state: WrappedState,
  action: ReturnType<typeof actions.undoTurn>,
) {
  if (state.raw.startOfLastTurn) {
    const stateToLoad: RawState = {
      ...state.raw.startOfLastTurn,
      startOfLastTurn: null,
      startOfThisTurn: state.raw.startOfLastTurn,
    };
    console.warn("undoing to", stateToLoad);
    state.act.loadGame({
      state: stateToLoad,
    });
    state.act.logMessage({
      message: "Reset to start of last turn.",
      type: "success",
    });
  } else {
    state.act.logMessage({
      message: "Cannot undo any further.",
    });
  }
}

registerHandler(undoTurn, actions.undoTurn);
