import { createStandardAction } from "typesafe-actions";
import { PLAYER_ID } from "~/constants";
import renderer from "~renderer";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const move = createStandardAction("MOVE")<{
  entityId: string;
  dx: number;
  dy: number;
}>();
export default move;

function moveHandler(
  state: WrappedState,
  action: ReturnType<typeof move>,
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
    entitiesAtNewPosition.some((other) => Boolean(other.blocking))
  ) {
    return;
  }
  state.act.updateEntity({
    id: entity.id,
    pos: newPosition,
  });
  if (entity.id === PLAYER_ID) {
    if (state.select.cursorPos() && renderer.isZoomedIn()) {
      state.act.moveCursor({ dx: action.payload.dx, dy: action.payload.dy });
    }
    state.act.playerTookTurn();
  }
}

registerHandler(moveHandler, move);
