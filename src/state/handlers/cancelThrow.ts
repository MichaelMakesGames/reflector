import * as actions from "~/state/actions";
import * as selectors from "~/state/selectors";
import { GameState } from "~/types";
import { removeEntities } from "./removeEntities";
import { removeEntity } from "./removeEntity";

export function cancelThrow(
  state: GameState,
  action: ReturnType<typeof actions.cancelThrow>,
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
  newState = removeEntity(
    newState,
    actions.removeEntity({ entityId: entity.id }),
  );
  return newState;
}
