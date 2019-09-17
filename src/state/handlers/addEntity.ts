import * as actions from "~/state/actions";
import { GameState, MakeRequired, Entity } from "~/types";
import { getPosKey } from "~/utils/geometry";
import { addRenderEntity } from "~/renderer";

export function addEntity(
  state: GameState,
  action: ReturnType<typeof actions.addEntity>,
): GameState {
  let newState = state;
  const { entity } = action.payload;
  let { entitiesByPosition } = newState;
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

  newState = {
    ...newState,
    entitiesByPosition,
    entities: {
      ...newState.entities,
      [entity.id]: entity,
    },
  };
  return newState;
}
