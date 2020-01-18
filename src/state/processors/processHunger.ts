import WrappedState from "~types/WrappedState";

export default function processHunger(state: WrappedState): void {
  if (!state.select.isNight() && state.select.turnsUntilTimeChange() === 1) {
    const population = state.select.population();
    if (state.select.canAffordToPay("FOOD", population)) {
      state.act.modifyResource({
        resource: "FOOD",
        amount: -population,
      });
    } else {
      state.act.modifyResource({
        resource: "FOOD",
        amount: -Math.floor(state.select.resource("FOOD")),
      });
      state.act.reduceMorale({ amount: 1 });
      state.act.logMessage({
        message:
          "There was not enough food to go around. Your colony has lost 1 morale.",
      });
    }
  }
}
