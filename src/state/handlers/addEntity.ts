import { Required } from "Object/_api";
import { addRenderEntity } from "~/renderer";
import actions from "~/state/actions";
import { Entity } from "~/types";
import { getPosKey } from "~/utils/geometry";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";
import { retargetLaserOnReflectorChange } from "~utils/lasers";

function addEntity(
  wrappedState: WrappedState,
  action: ReturnType<typeof actions.addEntity>,
): void {
  let state = wrappedState.raw;
  const entity = action.payload;
  let { entitiesByPosition } = state;
  if (entity.pos) {
    const key = getPosKey(entity.pos);
    entitiesByPosition = {
      ...entitiesByPosition,
      [key]: [...(entitiesByPosition[key] || []), entity.id],
    };
  }

  if (entity.pos && entity.display) {
    addRenderEntity(entity as Required<Entity, "pos" | "display">);
  }

  state = {
    ...state,
    entitiesByPosition,
    entities: {
      ...state.entities,
      [entity.id]: entity,
    },
  };

  wrappedState.setRaw(state);

  if (entity.reflector && entity.pos) {
    retargetLaserOnReflectorChange(wrappedState, entity.pos);
  }
}

registerHandler(addEntity, actions.addEntity);
