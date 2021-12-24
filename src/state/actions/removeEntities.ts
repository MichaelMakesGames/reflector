import { Required } from "ts-toolbelt/out/Object/Required";
import { createAction } from "typesafe-actions";
import { registerHandler } from "../handleAction";
import { Entity } from "../../types";
import WrappedState from "../../types/WrappedState";
import { getPosKey } from "../../lib/geometry";
import { retargetLaserOnReflectorChange } from "../../lib/lasers";

const removeEntities = createAction("REMOVE_ENTITIES")<string[]>();
export default removeEntities;

function removeEntitiesHandler(
  wrappedState: WrappedState,
  action: ReturnType<typeof removeEntities>
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
      wrappedState.renderer.removeEntity(id);
    }
    if (entity.reflector) {
      isRemovingReflector = true;
    }
    if (entity.pos && entity.smokeEmitter) {
      (
        entity as Required<Entity, "smokeEmitter">
      ).smokeEmitter.emitters.forEach((emitter) =>
        wrappedState.renderer.removeSmoke(
          (entity as Required<Entity, "pos">).pos,
          emitter.offset
        )
      );
    }
    if (entity.pos && entity.audioToggle) {
      wrappedState.audio.stopAtPos(entity.audioToggle.soundName, entity.pos);
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

registerHandler(removeEntitiesHandler, removeEntities);
