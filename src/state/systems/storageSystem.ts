import WrappedState from "../../types/WrappedState";
import { ResourceCode } from "../../data/resources";

export default function storageSystem(state: WrappedState): void {
  const resources = state.select.resources();
  const newResources = { ...resources };
  (Object.entries(newResources) as [ResourceCode, number][]).forEach(
    ([resource, amount]) => {
      newResources[resource] = Math.min(amount, state.select.storage(resource));
    }
  );
  state.setRaw({
    ...state.raw,
    resources: newResources,
  });

  if (newResources.POWER < resources.POWER) {
    state.select
      .entitiesWithComps("temperature")
      .forEach((entity) => state.act.temperatureIncrease(entity.id));
  } else {
    state.select
      .entitiesWithComps("temperature")
      .forEach((entity) => state.act.temperatureDecrease(entity.id));
  }
}
