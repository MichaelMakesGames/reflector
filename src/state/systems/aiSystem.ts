import { executePlan, clearPlan, makePlan } from "../../lib/ai";
import WrappedState from "../../types/WrappedState";

export default function aiSystem(state: WrappedState): void {
  for (const entity of state.select.entitiesWithComps("ai", "pos")) {
    executePlan(state, entity);
    clearPlan(state, entity);
  }
  for (const entity of state.select.entitiesWithComps("ai", "pos")) {
    makePlan(state, entity);
  }
}
