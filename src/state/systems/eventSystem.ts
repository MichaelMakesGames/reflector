import WrappedState from "~types/WrappedState";

export default function eventSystem(state: WrappedState): void {
  if (state.raw.events.COLONIST_DIED) {
    const count = state.raw.events.COLONIST_DIED;
    state.act.logMessage({
      message: `${count} ${
        count === 1 ? "colonist" : "colonists"
      } died, so you lost ${count} morale. Defend your colonists!`,
    });
  }

  state.setRaw({
    ...state.raw,
    events: {},
  });
}
