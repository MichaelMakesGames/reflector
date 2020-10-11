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
  const entityIdsSet = new Set(action.payload);

  const entities = {
    ...state.entities,
  };

  let isRemovingReflector = false;
  const impactedPosKeys = new Set<string>();

  for (const id of entityIds) {
    const entity = entities[id];
    if (entity.pos) {
      impactedPosKeys.add(getPosKey(entity.pos));
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

  const entitiesByPosition = {
    ...state.entitiesByPosition,
  };
  for (const key of impactedPosKeys) {
    entitiesByPosition[key] = entitiesByPosition[key].filter(
      (id) => !entityIdsSet.has(id),
    );
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
