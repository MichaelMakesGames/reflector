import WrappedState from "../../types/WrappedState";

export default function buildingSystem(state: WrappedState) {
  const blueprint = state.select.blueprint();
  if (blueprint && blueprint.pos) {
    state.act.blueprintSelect({
      template: blueprint.template,
      initialPos: blueprint.pos,
    });
  }
}
