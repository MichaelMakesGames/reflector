import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function cancelAutoMove(state: WrappedState): void {
  state.setRaw({
    ...state.raw,
    isAutoMoving: false,
  });
  state.act.setAutoMovePathToCursor();
}

registerHandler(cancelAutoMove, actions.cancelAutoMove);
