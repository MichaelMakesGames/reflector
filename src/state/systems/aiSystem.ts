import { Object } from "ts-toolbelt";
import { executePlan, clearPlan, makePlan } from "../../lib/ai";
import { Entity } from "../../types";
import WrappedState from "../../types/WrappedState";

export default function aiSystem(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps("ai", "pos")) {
    executePlan(state, entity);
    const refreshedEntity = state.select.entityById(entity.id);
    if (refreshedEntity && refreshedEntity.ai && refreshedEntity.pos) {
      clearPlan(
        state,
        refreshedEntity as Object.Required<Entity, "ai" | "pos">
      );
    }
  }

  state.setRaw({ ...state.raw, movementCostCache: {} });
  for (const entity of state.select.entitiesWithComps("ai", "pos")) {
    makePlan(state, entity);
  }
  state.setRaw({ ...state.raw, movementCostCache: {} });
}
