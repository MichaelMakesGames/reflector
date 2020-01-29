import WrappedState from "~types/WrappedState";
import { areConditionsMet } from "~utils/conditions";

export default function processProduction(state: WrappedState): void {
  const producers = state.select.entitiesWithComps("production");

  const productionByResource = producers.reduce<Record<Resource, number>>(
    (prev, cur) => {
      const { production } = cur;
      if (areConditionsMet(state, cur, ...production.conditions)) {
        // eslint-disable-next-line no-param-reassign
        prev[production.resource] += production.amount;
      }
      return prev;
    },
    {
      FOOD: 0,
      METAL: 0,
      POWER: 0,
      REFINED_METAL: 0,
    },
  );

  (Object.entries(productionByResource) as [Resource, number][]).forEach(
    ([resource, amount]) => {
      state.act.modifyResource({
        resource,
        amount,
      });
    },
  );
}
