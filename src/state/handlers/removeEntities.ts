import { Required } from "Object/_api";
import { removeRenderEntity, removeSmoke } from "~/renderer";
import actions from "~/state/actions";
import { registerHandler } from "~state/handleAction";
import { Entity } from "~types";
import WrappedState from "~types/WrappedState";
import { retargetLaserOnReflectorChange } from "~utils/lasers";
import { getPosKey } from "~utils/geometry";

function removeEntities(
  wrappedState: WrappedState,
  action: ReturnType<typeof actions.removeEntities>,
): void {
  const { raw: state } = wrappedState;
  const entityIds = action.payload.filter((id) => state.entities[id]);

  const entities = {
    ...state.entities,
  };

  let isRemovingReflector = false;
  const { entitiesByPosition, entitiesByComp } = state;

  for (const id of entityIds) {
    const entity = entities[id];
    for (const key in entity) {
      if (key !== "id" && key !== "template" && key !== "parentTemplate") {
        entitiesByComp[key] = entitiesByComp[key] || new Set();
        entitiesByComp[key].delete(id);
      }
    }
    if (entity.pos) {
      entitiesByPosition[getPosKey(entity.pos)].delete(id);
    }
    if (entity.pos && entity.display) {
      removeRenderEntity(id);
    }
    if (entity.reflector) {
      isRemovingReflector = true;
    }
    if (entity.pos && entity.smokeEmitter) {
      (entity as Required<
        Entity,
        "smokeEmitter"
      >).smokeEmitter.emitters.forEach((emitter) =>
        removeSmoke((entity as Required<Entity, "pos">).pos, emitter.offset),
      );
    }

    delete entities[id];
  }

  wrappedState.setRaw({
    ...state,
    entitiesByPosition,
    entities,
  });

  if (isRemovingReflector) {
    retargetLaserOnReflectorChange(wrappedState);
  }
}

registerHandler(removeEntities, actions.removeEntities);
