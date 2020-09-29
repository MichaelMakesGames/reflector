import WrappedState from "~types/WrappedState";
import { ResourceCode } from "~data/resources";
import { FOOD_PER_COLONIST } from "~constants";

export default function processHunger(state: WrappedState): void {
  if (state.select.turnOfNight() === 0) {
    const population = state.select.population();
    const amountOfFoodNeeded = population * FOOD_PER_COLONIST;
    if (state.select.canAffordToPay(ResourceCode.Food, amountOfFoodNeeded)) {
      state.act.modifyResource({
        resource: ResourceCode.Food,
        amount: -amountOfFoodNeeded,
        reason: "Colonists Eating",
      });
      state.act.logMessage({
        message: `Your ${population} ${
          population === 1 ? "colonist" : "colonists"
        } ate ${
          FOOD_PER_COLONIST * population
        } food. They won't eat again until tomorrow night.`,
        type: "success",
      });
    } else {
      state.act.modifyResource({
        resource: ResourceCode.Food,
        amount: -state.select.resource(ResourceCode.Food),
        reason: "Colonists Eating",
      });
      state.act.reduceMorale({ amount: 1 });
      state.act.logMessage({
        message: `There was not enough food to go around, so your colony lost 1 morale. Each colonists needs ${FOOD_PER_COLONIST} food per night.`,
      });
    }
  }
}
