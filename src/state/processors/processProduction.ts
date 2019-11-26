import WrappedState from "~types/WrappedState";

export default function processProduction(state: WrappedState): void {
  const producers = state.select.entitiesWithComps("production");

  const productionByResource = producers.reduce<{ [resource: string]: number }>(
    (prev, cur) => {
      const { production } = cur;
      // eslint-disable-next-line no-param-reassign
      prev[production.resource] =
        (prev[production.resource] || 0) + production.amount;
      return prev;
    },
    {},
  );

  Object.entries(productionByResource).forEach(([resource, amount]) => {
    state.act.modifyResource({
      resource,
      amount,
    });
  });
}
