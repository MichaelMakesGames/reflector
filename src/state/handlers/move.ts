import * as actions from "../actions";
import { PLAYER_ID } from "../../constants";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { playerTookTurn } from "./playerTookTurn";
import { updateEntity } from "./updateEntity";

export function move(
  state: GameState,
  action: ReturnType<typeof actions.move>,
): GameState {
  const entity = selectors.entity(state, action.payload.entityId);
  const { position } = entity;
  if (!position) {
    return state;
  }
  const newPosition = {
    x: position.x + action.payload.dx,
    y: position.y + action.payload.dy,
  };
  const entitiesAtNewPosition = selectors.entitiesAtPosition(
    state,
    newPosition,
  );
  if (
    entity.blocking &&
    !entity.throwing &&
    entitiesAtNewPosition.some(
      other => !!(other.blocking && !(entity.id === PLAYER_ID && other.pickup)),
    )
  ) {
    return state;
  }
  state = updateEntity(
    state,
    actions.updateEntity({
      id: entity.id,
      position: newPosition,
    }),
  );
  if (entity.id === PLAYER_ID) {
    state = playerTookTurn(state, actions.playerTookTurn());
  }
  return state;
}
