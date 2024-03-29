import { RNG } from "rot-js";
import { createAction } from "typesafe-actions";
import { PLAYER_ID } from "../../constants";
import WrappedState from "../../types/WrappedState";
import { registerHandler } from "../handleAction";
import { cosmeticSystems } from "../systems";

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
    const isFastMove =
      !state.raw.lastMoveWasFast &&
      state.select.entitiesAtPosition(newPosition).some((e) => e.road) &&
      state.select.entitiesAtPosition(pos).some((e) => e.road);

    if (isFastMove) {
      state.setRaw({
        ...state.raw,
        lastMoveWasFast: true,
      });
      state.act.logMessage({
        message:
          "You move fast on the road. You can move again this turn, or take another action.",
        type: "info",
      });
      cosmeticSystems.forEach((system) => system(state));
    } else {
      state.act.playerTookTurn();
    }
  }

  if (entity.colonist) {
    state.audio.playAtPos(
      RNG.getItem([
        "colonist_move_1",
        "colonist_move_2",
        "colonist_move_3",
        "colonist_move_4",
      ]) || "",
      newPosition,
      { rollOff: 0.5 }
    );
  } else if (entity.id === PLAYER_ID) {
    state.audio.setListenerPos(newPosition);
    state.audio.play(
      RNG.getItem([
        "player_move_1",
        "player_move_2",
        "player_move_3",
        "player_move_4",
      ]) || "",
      { volume: 0.1 }
    );
  } else if (entity.ai) {
    state.audio.playAtPos(
      RNG.getItem([
        "alien_move_1",
        "alien_move_2",
        "alien_move_3",
        "alien_move_4",
      ]) || "",
      newPosition
    );
  }
}

registerHandler(moveHandler, move);
