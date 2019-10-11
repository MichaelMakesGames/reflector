import { GameState } from "~types";
import * as selectors from "~state/selectors";

export default function processProduction(prevState: GameState): GameState {
  let state = prevState;

  const producers = selectors.entitiesWithComps(state, "production");

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

  const resources = { ...state.resources };
  Object.entries(productionByResource).forEach(([resource, amount]) => {
    resources[resource] = (resources[resource] || 0) + amount;
  });

  state = {
    ...state,
    resources,
  };

  return state;
}
