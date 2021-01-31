import WrappedState from "~types/WrappedState";

export default function processBuilding(state: WrappedState) {
  const blueprint = state.select.blueprint();
  if (blueprint) {
    state.act.blueprintSelect(blueprint.template);
  }
}
