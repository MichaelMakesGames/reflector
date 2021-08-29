import { RNG } from "rot-js";
import { createAction } from "typesafe-actions";
import { PLAYER_ID } from "../../constants";
import audio from "../../lib/audio";
import renderer from "../../renderer";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const move = createAction("MOVE")<{
  entityId: string;
  dx: number;
  dy: number;
}>();
export default move;

function moveHandler(
  state: WrappedState,
  action: ReturnType<typeof move>
): void {
  const entity = state.select.entityById(action.payload.entityId);
  if (!entity) return;
  const { pos } = entity;
  if (!pos) {
    return;
  }
  const newPosition = {
    x: pos.x + action.payload.dx,
    y: pos.y + action.payload.dy,
  };
  const entitiesAtNewPosition = state.select
    .entitiesAtPosition(newPosition)
    .filter((other) => other !== entity);
  if (
    entity.blocking &&
    state.select.isPositionBlocked(newPosition, [
      entity,
      ...(state.select.canFly(entity)
        ? entitiesAtNewPosition.filter((other) => state.select.isFlyable(other))
        : []),
    ])
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

  if (entity.colonist) {
    audio.playAtPos(
      RNG.getItem([
        "colonist_move_1",
        "colonist_move_2",
        "colonist_move_3",
        "colonist_move_4",
      ]) || "",
      newPosition,
      { rollOff: 0.75 }
    );
  } else if (entity.id === PLAYER_ID) {
    audio.setListenerPos(newPosition);
    audio.play(
      RNG.getItem([
        "player_move_1",
        "player_move_2",
        "player_move_3",
        "player_move_4",
      ]) || "",
      { volume: 0.1 }
    );
  } else if (entity.ai) {
    audio.playAtPos(
      RNG.getItem([
        "alien_move_1",
        "alien_move_2",
        "alien_move_3",
        "alien_move_4",
      ]) || "",
      newPosition,
      { rollOff: 0.1 }
    );
  }
}

registerHandler(moveHandler, move);
