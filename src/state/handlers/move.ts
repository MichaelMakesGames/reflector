import * as actions from "~/state/actions";
import { PLAYER_ID } from "~/constants";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import { playerTookTurn } from "./playerTookTurn";
import { updateEntity } from "./updateEntity";

export function move(
  state: GameState,
  action: ReturnType<typeof actions.move>,
): GameState {
  let newState = state;
  const entity = selectors.entity(newState, action.payload.entityId);
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
    !entity.throwing &&
    entitiesAtNewPosition.some(
      other => !!(other.blocking && !(entity.id === PLAYER_ID && other.pickup)),
    )
  ) {
    return newState;
  }
  newState = updateEntity(
    newState,
    actions.updateEntity({
      id: entity.id,
      pos: newPosition,
    }),
  );
  if (entity.id === PLAYER_ID) {
    newState = playerTookTurn(newState, actions.playerTookTurn());
  }
  return newState;
}
