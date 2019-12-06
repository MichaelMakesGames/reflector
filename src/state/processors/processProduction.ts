import WrappedState from "~types/WrappedState";

export default function processProduction(state: WrappedState): void {
  const producers = state.select.entitiesWithComps("production");

  const productionByResource = producers.reduce<Record<Resource, number>>(
    (prev, cur) => {
      const { production } = cur;
      // eslint-disable-next-line no-param-reassign
      prev[production.resource] += production.amount;
      return prev;
    },
    {
      METAL: 0,
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
