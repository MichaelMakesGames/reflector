import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState, MakeRequired, Entity } from "../../types";
import { getPosKey } from "../../utils";
import { addRenderEntity } from "../../renderer";

export function addEntity(
  state: GameState,
  action: ReturnType<typeof actions.addEntity>,
): GameState {
  const { entity } = action.payload;
  let { entitiesByPosition } = state;
  if (entity.pos) {
    const key = getPosKey(entity.pos);
    entitiesByPosition = {
      ...entitiesByPosition,
      [key]: [...(entitiesByPosition[key] || []), entity.id],
    };
  }

  if (entity.pos && entity.display) {
    addRenderEntity(entity as MakeRequired<Entity, "pos" | "display">);
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
