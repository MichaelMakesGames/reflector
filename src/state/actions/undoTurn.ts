import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import { RawState } from "../../types";
import WrappedState from "../../types/WrappedState";

const undoTurn = createAction("UNDO_TURN")<RawState | null>();
export default undoTurn;

function undoTurnHandler(
  state: WrappedState,
  action: ReturnType<typeof undoTurn>
) {
  if (action.payload) {
    state.act.loadGame({
      state: action.payload,
    });
    state.act.logMessage({
      message: "Reset to start of last turn.",
      type: "success",
    });
  } else {
    state.act.logMessage({
      message: "Cannot undo any further.",
      type: "error",
    });
  }
}

registerHandler(undoTurnHandler, undoTurn);
