import { Required } from "Object/_api";
import { removeRenderEntity, removeSmoke } from "~/renderer";
import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import { Entity } from "~types";
import WrappedState from "~types/WrappedState";
import { retargetLaserOnReflectorChange } from "~utils/lasers";

function removeEntities(
  wrappedState: WrappedState,
  action: ReturnType<typeof actions.removeEntities>,
): void {
  const { raw: state } = wrappedState;
  const { entitiesByPosition } = state;
  const entityIds = action.payload;
  for (const [key, ids] of Object.entries(entitiesByPosition)) {
    entitiesByPosition[key] = ids.filter((id) => !entityIds.includes(id));
  }
  const entities = {
    ...state.entities,
  };
  let isRemovingReflector = false;
  for (const id of entityIds) {
    if (entities[id].pos && entities[id].display) {
      removeRenderEntity(id);
    }
    if (entities[id].reflector) {
      isRemovingReflector = true;
    }
    if (entities[id].pos && entities[id].smokeEmitter) {
      (entities[id] as Required<
        Entity,
        "smokeEmitter"
      >).smokeEmitter.emitters.forEach((emitter) =>
        removeSmoke(
          (entities[id] as Required<Entity, "pos">).pos,
          emitter.offset,
        ),
      );
    }

    delete entities[id];
  }
  wrappedState.setRaw({
    ...state,
    entitiesByPosition: { ...entitiesByPosition },
    entities,
  });

  if (isRemovingReflector) {
    retargetLaserOnReflectorChange(wrappedState);
  }
}

registerHandler(removeEntities, actions.removeEntities);
