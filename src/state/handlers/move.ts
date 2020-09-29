import { PLAYER_ID, CURSOR_ID } from "~/constants";
import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { isZoomedIn } from "~renderer";

function move(
  state: WrappedState,
  action: ReturnType<typeof actions.move>,
): void {
  const entity = state.select.entityById(action.payload.entityId);
  const { pos } = entity;
  if (!pos) {
    return;
  }
  const newPosition = {
    x: pos.x + action.payload.dx,
    y: pos.y + action.payload.dy,
  };
  const entitiesAtNewPosition = state.select.entitiesAtPosition(newPosition);
  if (
    entity.blocking &&
    !entity.placing &&
    entitiesAtNewPosition.some((other) => Boolean(other.blocking))
  ) {
    return;
  }
  state.act.updateEntity({
    id: entity.id,
    pos: newPosition,
  });
  if (entity.id === PLAYER_ID && isZoomedIn()) {
    if (state.select.cursorPos()) {
      state.act.moveCursor({ dx: action.payload.dx, dy: action.payload.dy });
    }
    state.act.playerTookTurn();
  }
}

registerHandler(move, actions.move);
