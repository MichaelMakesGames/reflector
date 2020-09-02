import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { RawState } from "~types";

function undoTurn(
  state: WrappedState,
  action: ReturnType<typeof actions.undoTurn>,
) {
  if (state.raw.isStartOfTurn && state.raw.startOfLastTurn) {
    const stateToLoad: RawState = {
      ...state.raw.startOfLastTurn,
      isStartOfTurn: true,
      startOfLastTurn: null,
      startOfThisTurn: state.raw.startOfLastTurn,
    };
    state.act.loadGame({
      state: stateToLoad,
    });
    state.act.logMessage({
      message: "Reset to start of last turn.",
      type: "success",
    });
  } else if (!state.raw.isStartOfTurn && state.raw.startOfThisTurn) {
    const stateToLoad: RawState = {
      ...state.raw.startOfThisTurn,
      isStartOfTurn: true,
      startOfLastTurn: state.raw.startOfLastTurn,
      startOfThisTurn: state.raw.startOfThisTurn,
    };
    state.act.loadGame({
      state: stateToLoad,
    });
    state.act.logMessage({
      message: "Reset to start of this turn.",
      type: "success",
    });
  } else {
    state.act.logMessage({
      message: "Cannot undo any further.",
    });
  }
}

registerHandler(undoTurn, actions.undoTurn);
