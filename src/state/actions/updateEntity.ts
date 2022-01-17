import has from "has";
import { Required } from "ts-toolbelt/out/Object/Required";
import { Object } from "ts-toolbelt";
import { createAction } from "typesafe-actions";
import selectors from "../selectors";
import { Entity } from "../../types";
import { getPosKey } from "../../lib/geometry";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const updateEntity =
  createAction("UPDATE_ENTITY")<Object.Required<Partial<Entity>, "id">>();
export default updateEntity;

function updateEntityHandler(
  wrappedState: WrappedState,
  action: ReturnType<typeof updateEntity>
): void {
  const { raw: state } = wrappedState;
  const partial = action.payload;
  const prev = selectors.entityById(state, partial.id);
  if (!prev) {
    console.error("Tried to update nonexistant entity", partial);
    return;
  }
  const entity = { ...prev, ...partial };
  const { entitiesByPosition, entitiesByComp, entities } = state;

  for (const key in partial) {
    if (key !== "id" && key !== "template" && key !== "parentTemplate") {
      entitiesByComp[key] = entitiesByComp[key] || new Set();
      if (partial[key as keyof Entity]) {
        entitiesByComp[key].add(partial.id);
      } else {
        entitiesByComp[key].delete(partial.id);
      }
    }
  }

  if (has(partial, "pos")) {
    if (prev && prev.pos) {
      const key = getPosKey(prev.pos);
      entitiesByPosition[key].delete(prev.id);
    }
    if (entity.pos) {
      const key = getPosKey(entity.pos);
      entitiesByPosition[key] = entitiesByPosition[key] || new Set();
      entitiesByPosition[key].add(entity.id);
    }
  }

  if (has(partial, "pos") || has(partial, "display")) {
    if (entity.pos && entity.display) {
      if (!prev.pos || !prev.display) {
        wrappedState.renderer.addEntity(
          entity as Required<Entity, "pos" | "display">
        );
      } else {
        wrappedState.renderer.updateEntity(
          entity as Required<Entity, "pos" | "display">
        );
      }
    } else {
      wrappedState.renderer.removeEntity(entity.id);
    }
  }

  entities[entity.id] = entity;
}

registerHandler(updateEntityHandler, updateEntity);
