import { PLAYER_ID } from "~/constants";
import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { isPositionInMap } from "~utils/geometry";

function moveCursor(
  state: WrappedState,
  action: ReturnType<typeof actions.move>,
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

registerHandler(moveCursor, actions.moveCursor);
