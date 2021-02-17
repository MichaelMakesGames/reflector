import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const cancelAutoMove = createStandardAction("CANCEL_AUTO_MOVE")();
export default cancelAutoMove;

function cancelAutoMoveHandler(state: WrappedState): void {
  state.setRaw({
    ...state.raw,
    isAutoMoving: false,
  });
  state.act.setAutoMovePathToCursor();
}

registerHandler(cancelAutoMoveHandler, cancelAutoMove);
