import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState } from "../../types";
import { getPosKey } from "../../utils";

export function addEntity(
  state: GameState,
  action: ReturnType<typeof actions.addEntity>,
): GameState {
  const { entity } = action.payload;
  let { entitiesByPosition } = state;
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
