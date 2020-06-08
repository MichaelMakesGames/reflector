import WrappedState from "~types/WrappedState";
import { ResourceCode } from "~data/resources";

export default function processHunger(state: WrappedState): void {
  if (!state.select.isNight() && state.select.turnsUntilTimeChange() === 1) {
    const population = state.select.population();
    if (state.select.canAffordToPay(ResourceCode.Food, population)) {
      state.act.modifyResource({
        resource: ResourceCode.Food,
        amount: -population,
        reason: "Colonists Eating",
      });
    } else {
      state.act.modifyResource({
        resource: ResourceCode.Food,
        amount: -Math.floor(state.select.resource(ResourceCode.Food)),
        reason: "Colonists Eating",
      });
      state.act.reduceMorale({ amount: 1 });
      state.act.logMessage({
        message:
          "There was not enough food to go around. Your colony has lost 1 morale.",
      });
    }
  }
}
