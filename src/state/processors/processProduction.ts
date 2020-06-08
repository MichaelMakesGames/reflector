import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~utils/conditions";

export default function processProduction(state: WrappedState): void {
  const producers = state.select.entitiesWithComps("production");
  producers.forEach((entity) => {
    if (areConditionsMet(state, entity, ...entity.production.conditions)) {
      state.act.modifyResource({
        resource: entity.production.resource,
        amount: entity.production.amount,
        reason: entity.production.resourceChangeReason,
      });
    }
  });
}
