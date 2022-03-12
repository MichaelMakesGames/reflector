import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const cancelAutoMove = createAction("CANCEL_AUTO_MOVE")();
export default cancelAutoMove;

function cancelAutoMoveHandler(state: WrappedState): void {
  state.setRaw({
    ...state.raw,
    isAutoMoving: false,
  });
}

registerHandler(cancelAutoMoveHandler, cancelAutoMove);
