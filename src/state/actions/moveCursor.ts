import { createStandardAction } from "typesafe-actions";
import { registerHandler } from "~state/handleAction";
import { Direction } from "~types";
import WrappedState from "~types/WrappedState";
import { isPositionInMap } from "~lib/geometry";

const moveCursor = createStandardAction("MOVE_CURSOR")<Direction>();
export default moveCursor;

function moveCursorHandler(
  state: WrappedState,
  action: ReturnType<typeof moveCursor>,
): void {
  const pos = state.select.cursorPos() || state.select.playerPos();
  if (!pos) return;
  const newPosition = {
    x: pos.x + action.payload.dx,
    y: pos.y + action.payload.dy,
  };
  if (!isPositionInMap(newPosition)) return;
  state.act.setCursorPos(newPosition);
}

registerHandler(moveCursorHandler, moveCursor);
