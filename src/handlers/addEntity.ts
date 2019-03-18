import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../types";
import { getPosKey } from "../utils";

export function addEntity(
  state: GameState,
  action: ReturnType<typeof actions.addEntity>,
): GameState {
  const { entity } = action.payload;
  const prev = selectors.entity(state, action.payload.entity.id);
  let { entitiesByPosition } = state;
  if (prev && prev.position) {
    const key = getPosKey(prev.position);
    entitiesByPosition = {
      ...entitiesByPosition,
      [key]: entitiesByPosition[key].filter(id => id !== prev.id),
    };
  }
  if (entity.position) {
    const key = getPosKey(entity.position);
    entitiesByPosition = {
      ...entitiesByPosition,
      [key]: [...(entitiesByPosition[key] || []), entity.id],
    };
  }
  state = {
    ...state,
    entitiesByPosition,
    entities: {
      ...state.entities,
      [entity.id]: entity,
    },
  };
  return state;
}
