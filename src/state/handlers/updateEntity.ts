import has from "has";
import {
  addRenderEntity,
  removeRenderEntity,
  updateRenderEntity,
} from "~/renderer";
import actions from "~/state/actions";
import selectors from "~/state/selectors";
import { Entity, MakeRequired } from "~/types";
import { getPosKey } from "~/utils/geometry";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

function updateEntity(
  wrappedState: WrappedState,
  action: ReturnType<typeof actions.updateEntity>,
): void {
  const { raw: state } = wrappedState;
  const partial = action.payload;
  const prev = selectors.entityById(state, partial.id);
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

  wrappedState.setRaw({
    ...state,
    entitiesByPosition,
    entities: {
      ...state.entities,
      [entity.id]: {
        ...entity,
      },
    },
  });
}

registerHandler(updateEntity, actions.updateEntity);
