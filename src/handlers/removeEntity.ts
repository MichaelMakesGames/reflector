import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../types";
import { getPosKey } from "../utils";

export function removeEntity(
  state: GameState,
  action: ReturnType<typeof actions.removeEntity>,
): GameState {
  const prev = selectors.entity(state, action.payload.entityId);
  if (!prev) {
    console.warn(
      `tried to remove nonexistant entity ${action.payload.entityId}`,
    );
    return state;
  }
  let { entitiesByPosition } = state;
  if (prev.position) {
    const key = getPosKey(prev.position);
    entitiesByPosition = {
      ...entitiesByPosition,
      [key]: entitiesByPosition[key].filter(id => id !== prev.id),
    };
  }
  return {
    ...state,
    entitiesByPosition,
    entities: selectors
      .entityList(state)
      .filter(entity => entity.id !== prev.id)
      .reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}),
  };
}
