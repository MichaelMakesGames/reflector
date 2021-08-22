import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import { RawState } from "../../types";
import WrappedState from "../../types/WrappedState";

const undoTurn = createAction("UNDO_TURN")();
export default undoTurn;

function undoTurnHandler(
  state: WrappedState,
  action: ReturnType<typeof undoTurn>
) {
  if (state.raw.startOfLastTurn) {
    const stateToLoad: RawState = {
      ...state.raw.startOfLastTurn,
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
  } else {
    state.act.logMessage({
      message: "Cannot undo any further.",
    });
  }
}

registerHandler(undoTurnHandler, undoTurn);
