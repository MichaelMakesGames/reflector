import * as actions from "~/state/actions";
import { GameState } from "~/types";
import { removeRenderEntity } from "~/renderer";

export function removeEntities(
  state: GameState,
  action: ReturnType<typeof actions.removeEntities>,
): GameState {
  const { entitiesByPosition } = state;
  for (const [key, ids] of Object.entries(entitiesByPosition)) {
    entitiesByPosition[key] = ids.filter(
      id => !action.payload.entityIds.includes(id),
    );
  }
  const entities = {
    ...state.entities,
  };
  for (const id of action.payload.entityIds) {
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
