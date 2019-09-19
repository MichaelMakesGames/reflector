import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import { getDistance } from "~/utils/geometry";
import { removeEntities } from "./removeEntities";
import { updateEntity } from "./updateEntity";

export function executeThrow(
  state: GameState,
  action: ReturnType<typeof actions.executeThrow>,
): GameState {
  let newState = state;
  newState = removeEntities(
    newState,
    actions.removeEntities({
      entityIds: selectors
        .entityList(newState)
        .filter(e => e.fov)
        .map(e => e.id),
    }),
  );
  const entity = selectors.throwingTarget(newState);
  if (!entity) return newState;

  const player = selectors.player(newState);
  if (!player) return newState;

  const { pos } = entity;
  const distance = getDistance(pos, player.pos);
  if (distance > entity.throwing.range) return newState;

  const entitiesAtPosition = selectors.entitiesAtPosition(newState, pos);
  if (entitiesAtPosition.some(e => e.id !== entity.id && !!e.blocking))
    return newState;

  newState = updateEntity(
    newState,
    actions.updateEntity({
      id: entity.id,
      throwing: undefined,
    }),
  );

  return newState;
}
