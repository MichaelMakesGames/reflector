import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { getPosKey } from "../../utils";

export function updateEntity(
  state: GameState,
  action: ReturnType<typeof actions.updateEntity>,
): GameState {
  const partial = action.payload;
  const prev = selectors.entity(state, partial.id);
  if (!prev) {
    console.warn("tried to update nonexistant entity", partial);
  }
  const entity = { ...prev, ...partial };
  let { entitiesByPosition } = state;
  if (Object.hasOwnProperty.call(partial, "pos")) {
    if (prev && prev.pos) {
      const key = getPosKey(prev.pos);
      entitiesByPosition = {
        ...entitiesByPosition,
        [key]: entitiesByPosition[key].filter(id => id !== prev.id),
      };
    }
    if (entity.pos) {
      const key = getPosKey(entity.pos);
      entitiesByPosition = {
        ...entitiesByPosition,
        [key]: [...(entitiesByPosition[key] || []), entity.id],
      };
    }
  }
  state = {
    ...state,
    entitiesByPosition,
    entities: {
      ...state.entities,
      [entity.id]: {
        ...prev,
        ...entity,
      },
    },
  };
  return state;
}
