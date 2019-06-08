import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { removeRenderEntity } from "../../renderer";

export function removeEntities(
  state: GameState,
  action: ReturnType<typeof actions.removeEntities>,
): GameState {
  let { entitiesByPosition } = state;
  for (let [key, ids] of Object.entries(entitiesByPosition)) {
    entitiesByPosition[key] = ids.filter(
      id => !action.payload.entityIds.includes(id),
    );
  }
  const entities = {
    ...state.entities,
  };
  for (let id of action.payload.entityIds) {
    if (entities[id].pos && entities[id].display) {
      removeRenderEntity(id);
    }
    delete entities[id];
  }
  return {
    ...state,
    entitiesByPosition: { ...entitiesByPosition },
    entities,
  };
}
