import WrappedState from "~types/WrappedState";

export default function buildingSystem(state: WrappedState) {
  const blueprint = state.select.blueprint();
  if (blueprint) {
    state.act.blueprintSelect(blueprint.template);
  }
}
