import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../../types";

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
  return {
    ...state,
    entitiesByPosition: { ...entitiesByPosition },
    entities: selectors
      .entityList(state)
      .filter(entity => !action.payload.entityIds.includes(entity.id))
      .reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}),
  };
}
