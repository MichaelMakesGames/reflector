import has from "has";
import * as actions from "../actions";
import * as selectors from "../selectors";
import { GameState, MakeRequired, Entity } from "../../types";
import { getPosKey } from "../../utils/geometry";
import {
  updateRenderEntity,
  removeRenderEntity,
  addRenderEntity,
} from "../../renderer";

export function updateEntity(
  state: GameState,
  action: ReturnType<typeof actions.updateEntity>,
): GameState {
  let newState = state;
  const partial = action.payload;
  const prev = selectors.entity(newState, partial.id);
  if (!prev) {
    console.warn("tried to update nonexistant entity", partial);
  }
  const entity = { ...prev, ...partial };
  let { entitiesByPosition } = newState;
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

  if (has(partial, "pos") || has(partial, "display")) {
    if (entity.pos && entity.display) {
      if (!prev.pos || !prev.display) {
        addRenderEntity(entity as MakeRequired<Entity, "pos" | "display">);
      } else {
        updateRenderEntity(entity as MakeRequired<Entity, "pos" | "display">);
      }
    } else {
      removeRenderEntity(entity.id);
    }
  }

  newState = {
    ...newState,
    entitiesByPosition,
    entities: {
      ...newState.entities,
      [entity.id]: {
        ...entity,
      },
    },
  };
  return newState;
}
