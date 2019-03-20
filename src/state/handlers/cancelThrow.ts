import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { removeEntities } from "./removeEntities";
import { removeEntity } from "./removeEntity";

export function cancelThrow(
  state: GameState,
  action: ReturnType<typeof actions.cancelThrow>,
): GameState {
  state = removeEntities(
    state,
    actions.removeEntities({
      entityIds: selectors
        .entityList(state)
        .filter(e => e.fov)
        .map(e => e.id),
    }),
  );
  const entity = selectors.throwingTarget(state);
  if (!entity) return state;
  state = removeEntity(state, actions.removeEntity({ entityId: entity.id }));
  return state;
}
