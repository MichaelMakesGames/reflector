import actions from "~/state/actions";
import { PLAYER_ID } from "~/constants";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import handleAction, { registerHandler } from "~state/handleAction";

function move(
  state: GameState,
  action: ReturnType<typeof actions.move>,
): GameState {
  let newState = state;
  const entity = selectors.entityById(newState, action.payload.entityId);
  const { pos } = entity;
  if (!pos) {
    return newState;
  }
  const newPosition = {
    x: pos.x + action.payload.dx,
    y: pos.y + action.payload.dy,
  };
  const entitiesAtNewPosition = selectors.entitiesAtPosition(
    newState,
    newPosition,
  );
  if (
    entity.blocking &&
    !entity.placing &&
    entitiesAtNewPosition.some(other => Boolean(other.blocking))
  ) {
    return newState;
  }
  newState = handleAction(
    newState,
    actions.updateEntity({
      id: entity.id,
      pos: newPosition,
    }),
  );
  if (entity.id === PLAYER_ID) {
    newState = handleAction(newState, actions.playerTookTurn());
  }
  return newState;
}

registerHandler(move, actions.move);
